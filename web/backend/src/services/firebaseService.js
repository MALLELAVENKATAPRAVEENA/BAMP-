const { db, isDemo } = require('../config/firebase');

// Prepopulated Demo State
let demoPatients = [
  {
    id: "P-1001",
    fullName: "Aarav Sharma",
    age: 12,
    gender: "Male",
    dob: "2014-05-12",
    contactNumber: "+91 98765 43210",
    emailAddress: "aarav.sharma@example.com",
    address: "124 Medical Enclave, New Delhi, India",
    medicalHistory: "No major systemic illnesses. Good general health.",
    familyHistory: "Father has skeletal Class III malocclusion.",
    chiefComplaint: "Lower teeth are in front of upper teeth (Underbite).",
    diagnosis: "Skeletal Class III malocclusion due to maxillary hypoplasia and minor mandibular prognathism.",
    skeletalClassification: "Class III",
    growthPattern: "Hypodivergent",
    treatmentPlan: "Bone Anchored Maxillary Protraction (BAMP) with bone anchors in maxilla and mandible, combined with intermaxillary elastics.",
    orthodontistNotes: "Patient has high growth potential. Excellent candidate for BAMP.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "P-1002",
    fullName: "Priya Patel",
    age: 11,
    gender: "Female",
    dob: "2015-08-20",
    contactNumber: "+91 87654 32109",
    emailAddress: "priya.patel@example.com",
    address: "45 Hill Road, Mumbai, India",
    medicalHistory: "Allergic to penicillin.",
    familyHistory: "None reported.",
    chiefComplaint: "Upper jaw looks pushed back.",
    diagnosis: "Skeletal Class III malocclusion with severe maxillary hypoplasia.",
    skeletalClassification: "Class III",
    growthPattern: "Normodivergent",
    treatmentPlan: "BAMP treatment using miniplates and class III elastics to stimulate maxillary growth.",
    orthodontistNotes: "Early mixed dentition phase. Good cooperative patient.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "P-1003",
    fullName: "Rohan Das",
    age: 13,
    gender: "Male",
    dob: "2013-02-14",
    contactNumber: "+91 76543 21098",
    emailAddress: "rohan.das@example.com",
    address: "77 Salt Lake, Kolkata, India",
    medicalHistory: "Asthma under control.",
    familyHistory: "Uncle has underbite.",
    chiefComplaint: "Difficulty chewing and facial aesthetic concerns.",
    diagnosis: "Skeletal Class III malocclusion, maxillary retrognathism, hyperdivergent growth pattern.",
    skeletalClassification: "Class III",
    growthPattern: "Hyperdivergent",
    treatmentPlan: "BAMP treatment combined with orthognathic surgery consideration post-growth if necessary. Monitoring vertical dimension.",
    orthodontistNotes: "Vertical growth pattern requires careful anchoring vertical vectors.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

let demoPredictions = [
  {
    id: "PRED-001",
    patientId: "P-1001",
    patientName: "Aarav Sharma",
    successProbability: 88.5,
    confidenceScore: 92.0,
    riskLevel: "Low",
    growthResponse: "High Response Potential",
    estimatedDuration: "14-16 months",
    recommendedAction: "Proceed with standard BAMP protocol. Immediate anchor placement suggested to capitalize on late growth spurt.",
    expectedMaxillaryAdvancement: "3.8 mm",
    expectedSkeletalImprovement: "ANB angle improvement by +3.2°",
    measurements: {
      SNA: "77.5°",
      SNB: "80.5°",
      ANB: "-3.0°",
      Wits: "-5.2 mm",
      FMA: "22.5°",
      SellaNasionLength: "71.2 mm",
      MaxillaryLength: "45.5 mm"
    },
    explanation: "High success probability is driven by the patient's hypodivergent growth pattern, age (12), and active sutural growth windows. Skeletal anchorage will allow direct transmission of orthopaedic forces to the maxilla without dental side effects.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "PRED-002",
    patientId: "P-1002",
    patientName: "Priya Patel",
    successProbability: 82.4,
    confidenceScore: 89.5,
    riskLevel: "Low",
    growthResponse: "Moderate to High Response",
    estimatedDuration: "12-14 months",
    recommendedAction: "Initiate BAMP. Recommended elastic force: 150g per side initially, increasing to 250g after 1 month.",
    expectedMaxillaryAdvancement: "3.2 mm",
    expectedSkeletalImprovement: "ANB angle improvement by +2.8°",
    measurements: {
      SNA: "76.8°",
      SNB: "79.2°",
      ANB: "-2.4°",
      Wits: "-4.1 mm",
      FMA: "24.2°",
      SellaNasionLength: "68.5 mm",
      MaxillaryLength: "43.2 mm"
    },
    explanation: "Good skeletal response is predicted based on young age (11) and normodivergent growth pattern. Minor tooth crowding will resolve secondary to skeletal advancement.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let demoNotifications = [
  {
    id: "N-101",
    title: "AI Analysis Completed",
    message: "BAMP success outcome analysis for Aarav Sharma is complete. Click to review.",
    type: "success",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "N-102",
    title: "New Patient Registered",
    message: "Rohan Das was successfully added to the patient directory.",
    type: "info",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: "N-103",
    title: "Scan Upload Complete",
    message: "Cephalogram upload for Priya Patel verified successfully.",
    type: "info",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  }
];

let demoSettings = {
  doctorName: "Dr. Venkatapraveenamallela",
  email: "dr.venkat@hospital.org",
  specialization: "Orthodontist & Dentofacial Orthopedics",
  hospitalName: "Advanced Orthodontic Care & AI Research Center",
  firebaseProjectId: "bamp-ai-predictor",
  theme: "dark",
  notificationPrefs: {
    email: true,
    push: true,
    reports: true
  },
  aiModelVersion: "BAMP-Net v2.4 (Active)"
};

// Database Methods Abstraction Layer
const firebaseService = {
  // --- Patients ---
  async getPatients() {
    if (!isDemo && db) {
      const snapshot = await db.collection('patients').get();
      const patients = [];
      snapshot.forEach(doc => {
        patients.push({ id: doc.id, ...doc.data() });
      });
      return patients;
    }
    return demoPatients;
  },

  async getPatientById(id) {
    if (!isDemo && db) {
      const doc = await db.collection('patients').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
    return demoPatients.find(p => p.id === id) || null;
  },

  async createPatient(patientData) {
    if (!isDemo && db) {
      const docRef = await db.collection('patients').add({
        ...patientData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...patientData };
    }
    const newPatient = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      ...patientData,
      createdAt: new Date().toISOString()
    };
    demoPatients.unshift(newPatient);
    return newPatient;
  },

  async updatePatient(id, patientData) {
    if (!isDemo && db) {
      await db.collection('patients').doc(id).update(patientData);
      return { id, ...patientData };
    }
    const idx = demoPatients.findIndex(p => p.id === id);
    if (idx !== -1) {
      demoPatients[idx] = { ...demoPatients[idx], ...patientData };
      return demoPatients[idx];
    }
    return null;
  },

  async deletePatient(id) {
    if (!isDemo && db) {
      await db.collection('patients').doc(id).delete();
      return true;
    }
    const idx = demoPatients.findIndex(p => p.id === id);
    if (idx !== -1) {
      demoPatients.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- Predictions ---
  async getPredictions() {
    if (!isDemo && db) {
      const snapshot = await db.collection('predictions').get();
      const predictions = [];
      snapshot.forEach(doc => {
        predictions.push({ id: doc.id, ...doc.data() });
      });
      return predictions;
    }
    return demoPredictions;
  },

  async getPredictionById(id) {
    if (!isDemo && db) {
      const doc = await db.collection('predictions').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
    return demoPredictions.find(pred => pred.id === id) || null;
  },

  async createPrediction(predictionData) {
    if (!isDemo && db) {
      const docRef = await db.collection('predictions').add({
        ...predictionData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...predictionData };
    }
    const newPred = {
      id: `PRED-${Math.floor(100 + Math.random() * 900)}`,
      ...predictionData,
      createdAt: new Date().toISOString()
    };
    demoPredictions.unshift(newPred);
    return newPred;
  },

  // --- Notifications ---
  async getNotifications() {
    if (!isDemo && db) {
      const snapshot = await db.collection('notifications').orderBy('timestamp', 'desc').get();
      const notifications = [];
      snapshot.forEach(doc => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      return notifications;
    }
    return demoNotifications;
  },

  async createNotification(title, message, type = 'info') {
    const notification = {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (!isDemo && db) {
      const docRef = await db.collection('notifications').add(notification);
      return { id: docRef.id, ...notification };
    }
    
    notification.id = `N-${Math.floor(100 + Math.random() * 900)}`;
    demoNotifications.unshift(notification);
    return notification;
  },

  async markNotificationAsRead(id) {
    if (!isDemo && db) {
      await db.collection('notifications').doc(id).update({ read: true });
      return true;
    }
    const item = demoNotifications.find(n => n.id === id);
    if (item) {
      item.read = true;
      return true;
    }
    return false;
  },

  // --- Settings ---
  async getSettings() {
    if (!isDemo && db) {
      const doc = await db.collection('settings').doc('doctor_profile').get();
      return doc.exists ? doc.data() : demoSettings;
    }
    return demoSettings;
  },

  async updateSettings(settingsData) {
    if (!isDemo && db) {
      await db.collection('settings').doc('doctor_profile').set(settingsData, { merge: true });
      return settingsData;
    }
    demoSettings = { ...demoSettings, ...settingsData };
    return demoSettings;
  }
};

module.exports = firebaseService;
