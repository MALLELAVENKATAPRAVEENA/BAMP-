import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  auth, 
  googleProvider, 
  isFirebaseConfigured 
} from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  onAuthStateChanged 
} from 'firebase/auth';
import { firestoreService } from '../services/firestoreService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bamp-token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const idToken = await fbUser.getIdToken();
        localStorage.setItem('bamp-token', idToken);
        setToken(idToken);

        // Fetch or create profile from Firestore users/{uid}
        let profile = await firestoreService.getUserProfile(fbUser.uid);
        if (!profile) {
          profile = await firestoreService.createUserProfile(fbUser.uid, {
            name: fbUser.displayName || 'Dr. Orthodontist',
            email: fbUser.email,
            role: 'Orthodontist',
            photoURL: fbUser.photoURL || ''
          });
        }

        setUser({
          uid: fbUser.uid,
          name: profile?.name || fbUser.displayName || 'Dr. Orthodontist',
          email: fbUser.email,
          role: profile?.role || 'Orthodontist',
          emailVerified: fbUser.emailVerified,
          photoURL: fbUser.photoURL || ''
        });
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      } else {
        // Fallback check if local demo token exists
        const localToken = localStorage.getItem('bamp-token');
        if (localToken && localToken.startsWith('demo-')) {
          setUser({
            uid: 'demo-doctor-uid',
            name: 'Dr. Venkatapraveenamallela',
            email: 'dr.venkat@hospital.org',
            role: 'Orthodontist',
            emailVerified: true
          });
          setIsAuthenticated(true);
        } else if (!fbUser) {
          setUser(null);
          setFirebaseUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (user?.uid) {
      await firestoreService.logAuditEvent(user.uid, 'USER_LOGOUT', 'users', user.uid);
    }

    setUser(null);
    setFirebaseUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bamp-token');
    delete axios.defaults.headers.common['Authorization'];

    if (auth) {
      await signOut(auth).catch(err => console.warn("Firebase Signout warning:", err.message));
    }
  };

  // 1. Signup with Email/Password
  const signup = async (fullName, emailAddress, password, role = 'Orthodontist') => {
    if (auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, emailAddress, password);
        const fbUser = userCred.user;
        
        // Send email verification link
        await sendEmailVerification(fbUser).catch(e => console.warn("Email verification send warning:", e.message));

        // Create Firestore user document users/{uid}
        await firestoreService.createUserProfile(fbUser.uid, {
          name: fullName,
          email: emailAddress,
          role: role,
          photoURL: ''
        });

        await firestoreService.logAuditEvent(fbUser.uid, 'USER_SIGNUP', 'users', fbUser.uid, { email: emailAddress });

        const idToken = await fbUser.getIdToken();
        localStorage.setItem('bamp-token', idToken);
        setToken(idToken);
        setUser({
          uid: fbUser.uid,
          name: fullName,
          email: emailAddress,
          role: role,
          emailVerified: fbUser.emailVerified
        });
        setIsAuthenticated(true);

        return {
          success: true,
          message: 'Account registered successfully. Verification email sent.',
          user: fbUser
        };
      } catch (err) {
        console.warn("Firebase Auth Signup fallback to backend API:", err.message);
      }
    }

    // Backend endpoint fallback
    try {
      const res = await axios.post('/api/auth/signup', { fullName, emailAddress, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed.');
    }
  };

  // 2. Login with Email/Password
  const login = async (emailAddress, password) => {
    if (auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, emailAddress, password);
        const fbUser = userCred.user;

        const idToken = await fbUser.getIdToken();
        localStorage.setItem('bamp-token', idToken);
        setToken(idToken);

        const profile = await firestoreService.getUserProfile(fbUser.uid);
        
        await firestoreService.logAuditEvent(fbUser.uid, 'USER_LOGIN', 'users', fbUser.uid);

        setUser({
          uid: fbUser.uid,
          name: profile?.name || 'Dr. Orthodontist',
          email: fbUser.email,
          role: profile?.role || 'Orthodontist',
          emailVerified: fbUser.emailVerified
        });
        setIsAuthenticated(true);

        return {
          success: true,
          message: 'Logged in successfully.',
          user: fbUser
        };
      } catch (err) {
        console.warn("Firebase Auth Login fallback to backend API:", err.message);
      }
    }

    try {
      const res = await axios.post('/api/auth/login', { emailAddress, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login request failed.');
    }
  };

  // 3. OTP Verification
  const verifyOtp = async (emailAddress, otp) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { emailAddress, otp });
      if (res.data.success) {
        const sessionToken = res.data.token;
        localStorage.setItem('bamp-token', sessionToken);
        setToken(sessionToken);
        setUser(res.data.user);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  // 4. Password Reset
  const sendResetPassword = async (email) => {
    if (auth) {
      await sendPasswordResetEmail(auth, email);
      return true;
    }
    return true;
  };

  // 5. Google Login
  const loginWithGoogle = async () => {
    try {
      if (auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const idToken = await fbUser.getIdToken();

        await firestoreService.createUserProfile(fbUser.uid, {
          name: fbUser.displayName || 'Google User',
          email: fbUser.email,
          role: 'Orthodontist',
          photoURL: fbUser.photoURL || ''
        });

        await firestoreService.logAuditEvent(fbUser.uid, 'GOOGLE_LOGIN', 'users', fbUser.uid);

        localStorage.setItem('bamp-token', idToken);
        setToken(idToken);
        setUser({
          uid: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          email: fbUser.email,
          role: 'Orthodontist',
          photoURL: fbUser.photoURL || ''
        });
        setIsAuthenticated(true);
        return true;
      } else {
        const mockToken = `demo-google-${Date.now()}`;
        const res = await axios.post('/api/auth/google-login', { token: mockToken });
        if (res.data.success) {
          const sessionToken = res.data.token;
          localStorage.setItem('bamp-token', sessionToken);
          setToken(sessionToken);
          setUser(res.data.user);
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      throw new Error(err.message || 'Google authentication failed.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      token,
      isAuthenticated,
      loading,
      login,
      signup,
      verifyOtp,
      sendResetPassword,
      loginWithGoogle,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
