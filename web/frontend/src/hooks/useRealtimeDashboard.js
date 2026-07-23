import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useRealtimeDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPredictions: 0,
    activeUsers: 1,
    avgSuccessRate: 86.4
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // 1. Subscribe to Patients Collection
    const patientsQuery = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
    const unsubPatients = onSnapshot(patientsQuery, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ patientId: d.id, id: d.id, ...d.data() }));
      setRecentPatients(docs.slice(0, 5));
      setStats(prev => ({ ...prev, totalPatients: docs.length }));
      setLoading(false);
    }, (err) => {
      console.warn("[DASHBOARD] Patients listener fallback:", err.message);
      setLoading(false);
    });

    // 2. Subscribe to Predictions Collection
    const predsQuery = query(collection(db, 'predictions'), orderBy('createdAt', 'desc'));
    const unsubPreds = onSnapshot(predsQuery, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ predictionId: d.id, id: d.id, ...d.data() }));
      setRecentPredictions(docs.slice(0, 5));
      
      let avgRate = 86.4;
      if (docs.length > 0) {
        const sum = docs.reduce((acc, curr) => acc + (Number(curr.successProbability) || 85), 0);
        avgRate = Number((sum / docs.length).toFixed(1));
      }
      
      setStats(prev => ({
        ...prev,
        totalPredictions: docs.length,
        avgSuccessRate: avgRate
      }));
    }, (err) => {
      console.warn("[DASHBOARD] Predictions listener fallback:", err.message);
    });

    // 3. Subscribe to Audit Logs Collection
    const auditQuery = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(10));
    const unsubAudit = onSnapshot(auditQuery, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecentActivities(docs);
    }, (err) => {
      console.warn("[DASHBOARD] Audit listener fallback:", err.message);
    });

    return () => {
      unsubPatients();
      unsubPreds();
      unsubAudit();
    };
  }, []);

  return {
    stats,
    recentPatients,
    recentPredictions,
    recentActivities,
    loading
  };
};
