import { 
  db 
} from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

export const firestoreService = {
  // -------------------------------------------------------------
  // 1. USERS COLLECTION (users/{uid})
  // -------------------------------------------------------------
  async createUserProfile(uid, data) {
    const userDocRef = doc(db, 'users', uid);
    const userProfile = {
      uid,
      name: data.name || data.fullName || 'User',
      email: data.email || data.emailAddress || '',
      role: data.role || 'Orthodontist',
      photoURL: data.photoURL || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true
    };

    if (db) {
      try {
        await setDoc(userDocRef, userProfile, { merge: true });
      } catch (e) {
        console.warn("[FIRESTORE] createUserProfile fallback warning:", e.message);
      }
    }
    return userProfile;
  },

  async getUserProfile(uid) {
    if (!db) return null;
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      console.warn("[FIRESTORE] getUserProfile error:", e.message);
      return null;
    }
  },

  async updateUserLastLogin(uid) {
    if (!db) return;
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
        isActive: true
      });
    } catch (e) {
      console.warn("[FIRESTORE] updateUserLastLogin warning:", e.message);
    }
  },

  // -------------------------------------------------------------
  // 2. PATIENTS COLLECTION (patients/{patientId})
  // -------------------------------------------------------------
  async createPatient(patientData, doctorId) {
    const generatedId = patientData.patientId || patientData.id || `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullPatient = {
      patientId: generatedId,
      id: generatedId,
      doctorId: doctorId || 'current_user',
      patientName: patientData.fullName || patientData.patientName || 'Anonymous Patient',
      fullName: patientData.fullName || patientData.patientName || 'Anonymous Patient',
      age: parseInt(patientData.age) || 0,
      gender: patientData.gender || 'Male',
      dob: patientData.dob || '',
      contactNumber: patientData.contactNumber || '',
      emailAddress: patientData.emailAddress || '',
      address: patientData.address || '',
      medicalHistory: patientData.medicalHistory || '',
      familyHistory: patientData.familyHistory || '',
      chiefComplaint: patientData.chiefComplaint || '',
      diagnosis: patientData.diagnosis || 'Class III Malocclusion',
      skeletalClassification: patientData.skeletalClassification || 'Class III',
      growthPattern: patientData.growthPattern || 'Normodivergent',
      cephalometricMeasurements: patientData.cephalometricMeasurements || { SNA: 77.5, SNB: 80.5, FMA: 22.5 },
      uploadedImages: patientData.uploadedImages || [],
      treatmentPlan: patientData.treatmentPlan || 'BAMP Protocol',
      predictionResult: patientData.predictionResult || null,
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
    try {
      const patientsRef = collection(db, 'patients');
      const q = doctorId ? query(patientsRef, where('doctorId', '==', doctorId)) : query(patientsRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, patientId: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("[FIRESTORE] getPatients error:", e.message);
      return [];
    }
  },

  subscribeToPatients(callback) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const patientsRef = collection(db, 'patients');
    return onSnapshot(patientsRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, patientId: d.id, ...d.data() }));
      callback(list);
    }, (err) => {
      console.warn("[FIRESTORE] subscribeToPatients error:", err.message);
      callback([]);
    });
  },

  async updatePatient(patientId, updateFields) {
    if (!db) return;
    try {
      const patientRef = doc(db, 'patients', patientId);
      await updateDoc(patientRef, {
        ...updateFields,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn("[FIRESTORE] updatePatient error:", e.message);
    }
  },

  async deletePatient(patientId) {
    if (!db) return;
    try {
      const patientRef = doc(db, 'patients', patientId);
      await deleteDoc(patientRef);
    } catch (e) {
      console.warn("[FIRESTORE] deletePatient error:", e.message);
    }
  },

  // -------------------------------------------------------------
  // 3. PREDICTIONS COLLECTION (predictions/{predictionId})
  // -------------------------------------------------------------
  async createPrediction(predData) {
    const generatedId = predData.predictionId || `PRED-${Math.floor(100 + Math.random() * 900)}`;
    const fullPred = {
      predictionId: generatedId,
      id: generatedId,
      patientId: predData.patientId || '',
      doctorId: predData.doctorId || '',
      predictionScore: predData.predictionScore || predData.successProbability || 88.5,
      successProbability: predData.successProbability || 88.5,
      confidenceScore: predData.confidenceScore || 92.0,
      riskLevel: predData.riskLevel || 'Low',
      riskFactors: predData.riskFactors || ['Moderate mandibular growth rate'],
      recommendations: predData.recommendations || predData.recommendedAction || 'Proceed with standard BAMP protocol.',
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const predRef = collection(db, 'predictions');
        const newDoc = await addDoc(predRef, {
          ...fullPred,
          createdAt: serverTimestamp()
        });
        return { ...fullPred, predictionId: newDoc.id, id: newDoc.id };
      } catch (e) {
        console.warn("[FIRESTORE] createPrediction error:", e.message);
      }
    }
    return fullPred;
  },

  subscribeToPredictions(callback) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const predRef = collection(db, 'predictions');
    return onSnapshot(predRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, predictionId: d.id, ...d.data() }));
      callback(list);
    });
  },

  // -------------------------------------------------------------
  // 4. REPORTS COLLECTION (reports/{reportId})
  // -------------------------------------------------------------
  async saveReportMetadata(reportData) {
    const generatedId = reportData.reportId || `REP-${Math.floor(100 + Math.random() * 900)}`;
    const fullReport = {
      reportId: generatedId,
      id: generatedId,
      patientId: reportData.patientId || '',
      doctorId: reportData.doctorId || '',
      reportTitle: reportData.reportTitle || 'BAMP Cephalometric Evaluation Report',
      downloadUrl: reportData.downloadUrl || '',
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const reportRef = collection(db, 'reports');
        const newDoc = await addDoc(reportRef, {
          ...fullReport,
          createdAt: serverTimestamp()
        });
        return { ...fullReport, reportId: newDoc.id };
      } catch (e) {
        console.warn("[FIRESTORE] saveReportMetadata error:", e.message);
      }
    }
    return fullReport;
  },

  // -------------------------------------------------------------
  // 5. NOTIFICATIONS COLLECTION (notifications/{notificationId})
  // -------------------------------------------------------------
  async createNotification(title, message, type = 'info', userId = 'all') {
    const fullNotif = {
      notificationId: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      userId,
      read: false,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const notifRef = collection(db, 'notifications');
        await addDoc(notifRef, {
          ...fullNotif,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.warn("[FIRESTORE] createNotification error:", e.message);
      }
    }
    return fullNotif;
  },

  subscribeToNotifications(userId, callback) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const notifRef = collection(db, 'notifications');
    return onSnapshot(notifRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(list);
    });
  },

  async markNotificationRead(notifId) {
    if (!db) return;
    try {
      const notifRef = doc(db, 'notifications', notifId);
      await updateDoc(notifRef, { read: true });
    } catch (e) {
      console.warn("[FIRESTORE] markNotificationRead error:", e.message);
    }
  },

  // -------------------------------------------------------------
  // 6. FEEDBACK COLLECTION (feedback/{feedbackId})
  // -------------------------------------------------------------
  async submitFeedback(feedbackData) {
    const generatedId = `FB-${Date.now()}`;
    const fullFb = {
      feedbackId: generatedId,
      userId: feedbackData.userId || 'anonymous',
      message: feedbackData.message || feedbackData.content || '',
      rating: parseInt(feedbackData.rating) || 5,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const fbRef = collection(db, 'feedback');
        await addDoc(fbRef, {
          ...fullFb,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.warn("[FIRESTORE] submitFeedback error:", e.message);
      }
    }
    return fullFb;
  },

  // -------------------------------------------------------------
  // 7. AUDIT LOGS COLLECTION (audit_logs/{logId})
  // -------------------------------------------------------------
  async logAuditEvent(userId, action, entityType, entityId, metadata = {}) {
    const fullLog = {
      logId: `LOG-${Date.now()}`,
      userId: userId || 'anonymous',
      action, // e.g. 'USER_LOGIN', 'CREATE_PATIENT', 'GENERATE_PREDICTION', 'REPORT_DOWNLOAD'
      entityType, // e.g. 'users', 'patients', 'predictions', 'reports'
      entityId: entityId || '',
      metadata,
      timestamp: new Date().toISOString()
    };

    if (db) {
      try {
        const auditRef = collection(db, 'audit_logs');
        await addDoc(auditRef, {
          ...fullLog,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn("[FIRESTORE] logAuditEvent error:", e.message);
      }
    }
    return fullLog;
  },

  subscribeToAuditLogs(callback) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const auditRef = collection(db, 'audit_logs');
    return onSnapshot(auditRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(list);
    });
  }
};
