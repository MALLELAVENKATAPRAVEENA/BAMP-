const { db, isDemo } = require('../config/firebase');

// Fallback In-Memory Datasets
let demoPatients = [
  {
    id: "P-1001",
    patientId: "P-1001",
    fullName: "Aarav Sharma",
    age: 12,
    gender: "Male",
    diagnosis: "Skeletal Class III malocclusion due to maxillary hypoplasia.",
    skeletalClassification: "Class III",
    growthPattern: "Hypodivergent",
    treatmentPlan: "Bone Anchored Maxillary Protraction (BAMP) with bone anchors.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "P-1002",
    patientId: "P-1002",
    fullName: "Priya Patel",
    age: 11,
    gender: "Female",
    diagnosis: "Skeletal Class III malocclusion with severe maxillary hypoplasia.",
    skeletalClassification: "Class III",
    growthPattern: "Normodivergent",
    treatmentPlan: "BAMP treatment using miniplates and class III elastics.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let demoPredictions = [
  {
    id: "PRED-001",
    predictionId: "PRED-001",
    patientId: "P-1001",
    patientName: "Aarav Sharma",
    successProbability: 88.5,
    confidenceScore: 92.0,
    riskLevel: "Low",
    growthResponse: "High Response Potential",
    estimatedDuration: "14-16 months",
    recommendedAction: "Proceed with standard BAMP protocol.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let demoNotifications = [
  {
    id: "N-101",
    notificationId: "N-101",
    title: "AI Analysis Completed",
    message: "BAMP success outcome analysis for Aarav Sharma is complete.",
    type: "success",
    read: false,
    createdAt: new Date().toISOString()
  }
];

let demoFeedback = [];
let demoAuditLogs = [];
let demoUsers = [];

const firebaseService = {
  // 1. USERS COLLECTION (users/{uid})
  async getUserProfile(uid) {
    if (db) {
      try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) return { uid: doc.id, ...doc.data() };
      } catch (e) { console.warn("[FB SERVICE] getUserProfile fallback:", e.message); }
    }
    return demoUsers.find(u => u.uid === uid) || null;
  },

  async createUserProfile(uid, userData) {
    const userDoc = {
      uid,
      name: userData.name || userData.fullName || 'Orthodontist Doctor',
      email: userData.email || userData.emailAddress || '',
      role: userData.role || 'Orthodontist',
      photoURL: userData.photoURL || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true
    };

    if (db) {
      try {
        await db.collection('users').doc(uid).set(userDoc, { merge: true });
        return userDoc;
      } catch (e) { console.warn("[FB SERVICE] createUserProfile fallback:", e.message); }
    }
    demoUsers.push(userDoc);
    return userDoc;
  },

  // 2. PATIENTS COLLECTION (patients/{patientId})
  async getPatients() {
    if (db) {
      try {
        const snapshot = await db.collection('patients').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ patientId: doc.id, id: doc.id, ...doc.data() }));
      } catch (e) { console.warn("[FB SERVICE] getPatients fallback:", e.message); }
    }
    return demoPatients;
  },

  async getPatientById(id) {
    if (db) {
      try {
        const doc = await db.collection('patients').doc(id).get();
        if (doc.exists) return { patientId: doc.id, id: doc.id, ...doc.data() };
      } catch (e) { console.warn("[FB SERVICE] getPatientById fallback:", e.message); }
    }
    return demoPatients.find(p => p.id === id || p.patientId === id) || null;
  },

  async createPatient(patientData) {
    const newPatient = {
      ...patientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = await db.collection('patients').add(newPatient);
        return { patientId: docRef.id, id: docRef.id, ...newPatient };
      } catch (e) { console.warn("[FB SERVICE] createPatient fallback:", e.message); }
    }
    newPatient.id = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    newPatient.patientId = newPatient.id;
    demoPatients.unshift(newPatient);
    return newPatient;
  },

  async updatePatient(id, updates) {
    if (db) {
      try {
        await db.collection('patients').doc(id).update({
          ...updates,
          updatedAt: new Date().toISOString()
        });
        return { patientId: id, id, ...updates };
      } catch (e) { console.warn("[FB SERVICE] updatePatient fallback:", e.message); }
    }
    const idx = demoPatients.findIndex(p => p.id === id || p.patientId === id);
    if (idx !== -1) {
      demoPatients[idx] = { ...demoPatients[idx], ...updates, updatedAt: new Date().toISOString() };
      return demoPatients[idx];
    }
    return null;
  },

  async deletePatient(id) {
    if (db) {
      try {
        await db.collection('patients').doc(id).delete();
        return true;
      } catch (e) { console.warn("[FB SERVICE] deletePatient fallback:", e.message); }
    }
    const idx = demoPatients.findIndex(p => p.id === id || p.patientId === id);
    if (idx !== -1) {
      demoPatients.splice(idx, 1);
      return true;
    }
    return false;
  },

  // 3. PREDICTIONS COLLECTION (predictions/{predictionId})
  async getPredictions() {
    if (db) {
      try {
        const snapshot = await db.collection('predictions').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ predictionId: doc.id, id: doc.id, ...doc.data() }));
      } catch (e) { console.warn("[FB SERVICE] getPredictions fallback:", e.message); }
    }
    return demoPredictions;
  },

  async createPrediction(predictionData) {
    const newPred = {
      ...predictionData,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = await db.collection('predictions').add(newPred);
        return { predictionId: docRef.id, id: docRef.id, ...newPred };
      } catch (e) { console.warn("[FB SERVICE] createPrediction fallback:", e.message); }
    }
    newPred.id = `PRED-${Math.floor(100 + Math.random() * 900)}`;
    newPred.predictionId = newPred.id;
    demoPredictions.unshift(newPred);
    return newPred;
  },

  // 4. NOTIFICATIONS COLLECTION (notifications/{notificationId})
  async getNotifications() {
    if (db) {
      try {
        const snapshot = await db.collection('notifications').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ notificationId: doc.id, id: doc.id, ...doc.data() }));
      } catch (e) { console.warn("[FB SERVICE] getNotifications fallback:", e.message); }
    }
    return demoNotifications;
  },

  async createNotification(title, message, type = 'info', userId = 'all') {
    const notif = {
      title,
      message,
      type,
      read: false,
      userId,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = await db.collection('notifications').add(notif);
        return { notificationId: docRef.id, id: docRef.id, ...notif };
      } catch (e) { console.warn("[FB SERVICE] createNotification fallback:", e.message); }
    }
    notif.id = `N-${Math.floor(100 + Math.random() * 900)}`;
    notif.notificationId = notif.id;
    demoNotifications.unshift(notif);
    return notif;
  },

  // 5. AUDIT LOGS COLLECTION (audit_logs/{logId})
  async logAuditEvent(userId, action, entityType, entityId = '', details = {}) {
    const logItem = {
      userId: userId || 'anonymous',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };

    if (db) {
      try {
        await db.collection('audit_logs').add(logItem);
        return logItem;
      } catch (e) { console.warn("[FB SERVICE] logAuditEvent fallback:", e.message); }
    }
    demoAuditLogs.unshift(logItem);
    return logItem;
  },

  // 6. FEEDBACK COLLECTION (feedback/{feedbackId})
  async submitFeedback(userId, message, rating = 5) {
    const feedbackItem = {
      userId,
      message,
      rating,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = await db.collection('feedback').add(feedbackItem);
        return { feedbackId: docRef.id, id: docRef.id, ...feedbackItem };
      } catch (e) { console.warn("[FB SERVICE] submitFeedback fallback:", e.message); }
    }
    demoFeedback.unshift(feedbackItem);
    return feedbackItem;
  }
};

module.exports = firebaseService;
