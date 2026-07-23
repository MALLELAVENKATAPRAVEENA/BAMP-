const jwt = require('jsonwebtoken');
const { isDemo, admin } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretbampjwtkey';

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Handle Demo/Local token bypass
    if (token === 'demo-token' || (isDemo && token.startsWith('demo-'))) {
      req.user = {
        uid: 'demo-doctor-uid',
        email: 'dr.venkat@hospital.org',
        name: 'Dr. Venkatapraveenamallela',
        role: 'Orthodontist'
      };
      return next();
    }

    if (!isDemo) {
      try {
        // Attempt verifying with Firebase Admin ID Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || 'Dr. Venkatapraveenamallela',
          role: 'Orthodontist'
        };
        return next();
      } catch (fbError) {
        // Fallback to local JWT if it's a signed JWT (e.g. email/password authentication via our backend)
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          req.user = decoded;
          return next();
        } catch (jwtError) {
          return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
        }
      }
    } else {
      // Local signed JWT verification in Demo Mode
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (jwtError) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token in demo mode.' });
      }
    }
  } catch (err) {
    next(err);
  }
}

module.exports = auth;
