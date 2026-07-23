import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useNotifications = (userId = 'all') => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const notifQuery = query(
      collection(db, 'notifications'), 
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(notifQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        notificationId: doc.id,
        ...doc.data()
      }));
      
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read).length);
      setLoading(false);
    }, (err) => {
      console.warn("[NOTIFICATIONS] Listener fallback:", err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  return { notifications, unreadCount, loading };
};
