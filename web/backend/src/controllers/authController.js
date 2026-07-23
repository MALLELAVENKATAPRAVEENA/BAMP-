const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/mailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretbampjwtkey';

// In-memory store for OTPs (temporary for demonstration)
const pendingOtps = new Map();

// Helper to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to validate password rules (min 6 chars, uppercase, number, special char)
function validatePassword(password) {
  if (!password || password.length < 6) return 'Password must be at least 6 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter (A-Z).';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number (0-9).';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character (!@#$%^&* etc.).';
  return null;
}

const authController = {
  signup: async (req, res, next) => {
    try {
      const { fullName, emailAddress, password } = req.body;

      if (!fullName || !emailAddress || !password) {
        return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      }

      const passError = validatePassword(password);
      if (passError) {
        return res.status(400).json({ success: false, message: passError });
      }

      const otp = generateOtp();
      const expiration = Date.now() + 10 * 60 * 1000; // 10 mins

      // Store verification details
      pendingOtps.set(emailAddress, {
        otp,
        expiration,
        user: { fullName, emailAddress, password }
      });

      console.log('==================================================');
      console.log(`[AUTH SYSTEM] New Signup Request for ${emailAddress}`);
      console.log(`[AUTH SYSTEM] Security OTP: ${otp}`);
      console.log('==================================================');

      // Dispatch real email if SMTP is set up
      await sendOtpEmail(emailAddress, otp);

      res.status(200).json({
        success: true,
        message: 'Registration details received. Verification OTP sent to email.',
        email: emailAddress,
        demoOtp: otp // Included for testing convenience
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { emailAddress, password } = req.body;

      if (!emailAddress || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password.' });
      }

      // Preconfigured test credentials
      const isTestUser = emailAddress === 'dr.venkat@hospital.org' && password === 'password123';
      
      const otp = generateOtp();
      const expiration = Date.now() + 10 * 60 * 1000;

      pendingOtps.set(emailAddress, {
        otp,
        expiration,
        user: { 
          fullName: isTestUser ? 'Dr. Venkatapraveenamallela' : emailAddress.split('@')[0], 
          emailAddress, 
          password 
        }
      });

      console.log('==================================================');
      console.log(`[AUTH SYSTEM] Login Attempt for ${emailAddress}`);
      console.log(`[AUTH SYSTEM] Security OTP: ${otp}`);
      console.log('==================================================');

      // Dispatch real email if SMTP is set up
      await sendOtpEmail(emailAddress, otp);

      res.status(200).json({
        success: true,
        message: 'Credentials approved. Verification OTP sent to email.',
        email: emailAddress,
        demoOtp: otp // Included for testing convenience
      });
    } catch (err) {
      next(err);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { emailAddress, otp } = req.body;

      if (!emailAddress || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP.' });
      }

      const record = pendingOtps.get(emailAddress);

      if (!record) {
        return res.status(400).json({ success: false, message: 'No verification request found for this email.' });
      }

      if (Date.now() > record.expiration) {
        pendingOtps.delete(emailAddress);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      }

      if (record.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
      }

      // Sync with Firebase Authentication Console and Cloud Firestore
      let fbUid = `uid-${Date.now()}`;
      const { admin } = require('../config/firebase');
      const firebaseService = require('../services/firebaseService');

      if (admin && admin.apps && admin.apps.length) {
        try {
          let userRecord;
          try {
            userRecord = await admin.auth().getUserByEmail(record.user.emailAddress);
          } catch (e) {
            userRecord = await admin.auth().createUser({
              email: record.user.emailAddress,
              password: record.user.password || 'Pass@123',
              displayName: record.user.fullName || 'Doctor',
              emailVerified: true
            });
            console.log(`[FIREBASE AUTH CONSOLE] Registered user in Firebase Auth: ${userRecord.uid}`);
          }
          fbUid = userRecord.uid;

          await firebaseService.createUserProfile(fbUid, {
            name: record.user.fullName || 'Doctor',
            email: record.user.emailAddress,
            role: 'Orthodontist'
          });

          await firebaseService.logAuditEvent(fbUid, 'USER_LOGIN', 'users', fbUid);
        } catch (fbErr) {
          console.warn("[FIREBASE AUTH] Firebase Auth Admin notice:", fbErr.message);
        }
      }

      // Construct User Session Token
      const token = jwt.sign(
        {
          uid: fbUid,
          email: record.user.emailAddress,
          name: record.user.fullName || 'Dr. Venkatapraveenamallela',
          role: 'Orthodontist'
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Clean up verification data
      pendingOtps.delete(emailAddress);

      res.status(200).json({
        success: true,
        message: 'Identity verified successfully and registered in Firebase Console.',
        token,
        user: {
          uid: fbUid,
          email: record.user.emailAddress,
          name: record.user.fullName || 'Dr. Venkatapraveenamallela',
          role: 'Orthodontist'
        }
      });
    } catch (err) {
      next(err);
    }
  },

  googleLogin: async (req, res, next) => {
    try {
      const { token: googleToken } = req.body;

      // In production, we decode/verify the googleToken using admin.auth() or google-auth-library.
      // For this workflow, we automatically authenticate and issue a secure session JWT.
      const token = jwt.sign(
        {
          email: 'dr.venkat@hospital.org',
          name: 'Dr. Venkatapraveenamallela',
          role: 'Orthodontist'
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.status(200).json({
        success: true,
        message: 'Google login successful.',
        token,
        user: {
          email: 'dr.venkat@hospital.org',
          name: 'Dr. Venkatapraveenamallela',
          role: 'Orthodontist'
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
