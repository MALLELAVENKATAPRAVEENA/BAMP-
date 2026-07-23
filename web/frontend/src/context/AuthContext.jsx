import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bamp-token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Set axios default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token/fetch settings
          const res = await axios.get('/api/settings');
          if (res.data.success) {
            setUser({
              name: res.data.data.doctorName || 'Dr. Venkatapraveenamallela',
              email: res.data.data.email || 'dr.venkat@hospital.org',
              role: 'Orthodontist',
              hospital: res.data.data.hospitalName
            });
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error("Token verification failed:", err.message);
          
          // If server fails or offline, check if token is demo-token and load default
          if (token.startsWith('demo-')) {
            setUser({
              name: 'Dr. Venkatapraveenamallela',
              email: 'dr.venkat@hospital.org',
              role: 'Orthodontist',
              hospital: 'Advanced Orthodontic Care & AI Research Center'
            });
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bamp-token');
    delete axios.defaults.headers.common['Authorization'];
    
    if (isFirebaseConfigured && auth) {
      signOut(auth).catch(err => console.error("Firebase Signout Error:", err));
    }
  };

  // 1. Initial Email/Password Authentication (Triggers OTP verification page)
  const login = async (emailAddress, password) => {
    try {
      const res = await axios.post('/api/auth/login', { emailAddress, password });
      return res.data; // contains OTP code and success message
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login request failed.');
    }
  };

  const signup = async (fullName, emailAddress, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { fullName, emailAddress, password });
      return res.data; // contains OTP and success message
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed.');
    }
  };

  // 2. OTP Verification (Verifies identity and registers token/session)
  const verifyOtp = async (emailAddress, otp) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { emailAddress, otp });
      if (res.data.success) {
        const sessionToken = res.data.token;
        const userData = res.data.user;
        
        localStorage.setItem('bamp-token', sessionToken);
        setToken(sessionToken);
        setUser(userData);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  // 3. Google OAuth Login
  const loginWithGoogle = async () => {
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        
        // Pass firebase token to our backend
        const res = await axios.post('/api/auth/google-login', { token: idToken });
        if (res.data.success) {
          const sessionToken = res.data.token;
          localStorage.setItem('bamp-token', sessionToken);
          setToken(sessionToken);
          setUser(res.data.user);
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
          return true;
        }
      } else {
        // Mock Google sign-in fallback
        console.log("Using Mock Google Auth Sign-in");
        const mockToken = `demo-google-${Date.now()}`;
        const res = await axios.post('/api/auth/google-login', { token: mockToken });
        if (res.data.success) {
          const sessionToken = res.data.token;
          localStorage.setItem('bamp-token', sessionToken);
          setToken(sessionToken);
          setUser(res.data.user);
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
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
      token,
      isAuthenticated,
      loading,
      login,
      signup,
      verifyOtp,
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
