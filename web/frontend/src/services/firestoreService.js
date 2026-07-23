import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const firestoreService = {
  // -------------------------------------------------------------
  // 1. USERS COLLECTION (users/{uid})
  // -------------------------------------------------------------
  async createUserProfile(uid, userData) {
    if (!db) return null;
    const userRef = doc(db, 'users', uid);
    const profile = {
      uid,
      name: userData.name || userData.fullName || 'Orthodontist Doctor',
      email: userData.email || userData.emailAddress || '',
      role: userData.role || 'Orthodontist',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true
    };
    await setDoc(userRef, profile, { merge: true });
    return profile;
  },

  async getUserProfile(uid) {
    if (!db || !uid) return null;
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async updateUserProfile(uid, updates) {
    if (!db || !uid) return null;
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      lastLogin: serverTimestamp()
    });
    return true;
  },

  // -------------------------------------------------------------
  // 2. PATIENTS COLLECTION (patients/{patientId})
  // -------------------------------------------------------------
  async createPatient(patientData, doctorId) {
    const generatedId = patientData.patientId || patientData.id || `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullPatient = {
      patientId: generatedId,
      id: generatedId,
      ...patientData,
      doctorId: doctorId || 'current_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        const patientsRef = collection(db, 'patients');
        const newDoc = await addDoc(patientsRef, {
          ...fullPatient,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { ...fullPatient, patientId: newDoc.id, id: newDoc.id };
      } catch (e) {
        console.warn("[FIRESTORE] createPatient fallback:", e.message);
      }
    }
    return fullPatient;
  },

  async getPatients(doctorId = null) {
    if (!db) return [];
    const patientsRef = collection(db, 'patients');
    let q = query(patientsRef, orderBy('createdAt', 'desc'));
    if (doctorId) {
      q = query(patientsRef, where('doctorId', '==', doctorId), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ patientId: doc.id, id: doc.id, ...doc.data() }));
  },

  subscribeToPatients(callback, doctorId = null) {
    if (!db) return () => {};
    const patientsRef = collection(db, 'patients');
    let q = query(patientsRef, orderBy('createdAt', 'desc'));
    if (doctorId) {
      q = query(patientsRef, where('doctorId', '==', doctorId), orderBy('createdAt', 'desc'));
    }
    return onSnapshot(q, (snapshot) => {
      const patients = snapshot.docs.map(doc => ({ patientId: doc.id, id: doc.id, ...doc.data() }));
      callback(patients);
    });
  },

  async updatePatient(patientId, updates) {
    if (!db || !patientId) return null;
    const patientRef = doc(db, 'patients', patientId);
    await updateDoc(patientRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  },

  async deletePatient(patientId) {
    if (!db || !patientId) return false;
    const patientRef = doc(db, 'patients', patientId);
    await deleteDoc(patientRef);
    return true;
  },

  // -------------------------------------------------------------
  // 3. PREDICTIONS COLLECTION (predictions/{predictionId})
  // -------------------------------------------------------------
  async createPrediction(predictionData) {
    if (!db) return null;
    const predsRef = collection(db, 'predictions');
    const newDoc = await addDoc(predsRef, {
      ...predictionData,
      createdAt: serverTimestamp()
    });
    return { predictionId: newDoc.id, id: newDoc.id, ...predictionData };
  },

  async getPredictions(patientId = null) {
    if (!db) return [];
    const predsRef = collection(db, 'predictions');
    let q = query(predsRef, orderBy('createdAt', 'desc'));
    if (patientId) {
      q = query(predsRef, where('patientId', '==', patientId), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ predictionId: doc.id, id: doc.id, ...doc.data() }));
  },

  subscribeToPredictions(callback) {
    if (!db) return () => {};
    const predsRef = collection(db, 'predictions');
    const q = query(predsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const preds = snapshot.docs.map(doc => ({ predictionId: doc.id, id: doc.id, ...doc.data() }));
      callback(preds);
    });
  },

  // -------------------------------------------------------------
  // 4. REPORTS COLLECTION (reports/{reportId})
  // -------------------------------------------------------------
  async createReport(reportData) {
    if (!db) return null;
    const reportsRef = collection(db, 'reports');
    const newDoc = await addDoc(reportsRef, {
      ...reportData,
      createdAt: serverTimestamp()
    });
    return { reportId: newDoc.id, id: newDoc.id, ...reportData };
  },

  async getReports() {
    if (!db) return [];
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ reportId: doc.id, id: doc.id, ...doc.data() }));
  },

  // -------------------------------------------------------------
  // 5. NOTIFICATIONS COLLECTION (notifications/{notificationId})
  // -------------------------------------------------------------
  async createNotification(title, message, type = 'info', userId = 'all') {
    if (!db) return null;
    const notifsRef = collection(db, 'notifications');
    const newDoc = await addDoc(notifsRef, {
      title,
      message,
      type,
      read: false,
      userId,
      createdAt: serverTimestamp()
    });
    return { notificationId: newDoc.id, id: newDoc.id, title, message, type };
  },

  subscribeToNotifications(userId, callback) {
    if (!db) return () => {};
    const notifsRef = collection(db, 'notifications');
    const q = query(
      notifsRef, 
      where('userId', 'in', [userId || 'all', 'all']), 
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ notificationId: doc.id, id: doc.id, ...doc.data() }));
      callback(list);
    }, (error) => {
      console.warn("Notification listener fallback:", error.message);
    });
  },

  async markNotificationRead(notificationId) {
    if (!db || !notificationId) return;
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  },

  // -------------------------------------------------------------
  // 6. FEEDBACK COLLECTION (feedback/{feedbackId})
  // -------------------------------------------------------------
  async submitFeedback(userId, message, rating = 5) {
    if (!db) return null;
    const feedbackRef = collection(db, 'feedback');
    const newDoc = await addDoc(feedbackRef, {
      userId,
      message,
      rating,
      createdAt: serverTimestamp()
    });
    return { feedbackId: newDoc.id, id: newDoc.id };
  },

  // -------------------------------------------------------------
  // 7. AUDIT LOGS COLLECTION (audit_logs/{logId})
  // -------------------------------------------------------------
  async logAuditEvent(userId, action, entityType, entityId = null, extraDetails = {}) {
    if (!db) return null;
    try {
      const logsRef = collection(db, 'audit_logs');
      await addDoc(logsRef, {
        userId: userId || 'anonymous',
        action,
        entityType,
        entityId: entityId || '',
        details: extraDetails,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.warn("[AUDIT LOG] Log write skipped:", e.message);
    }
  }
};
