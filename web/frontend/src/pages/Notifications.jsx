import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Cpu, UserPlus, FileText, CheckCircle2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { useNotifications } from '../hooks/useNotifications';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, loading: isLoading } = useNotifications(user?.uid || 'all');

  const handleMarkAsRead = async (id) => {
    try {
      await firestoreService.markNotificationRead(id);
      toast.success("Alert marked as read.");
    } catch (err) {
      toast.error("Failed to mark as read.");
    }
  };

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('patient')) return <UserPlus className="h-4.5 w-4.5 text-blue-500" />;
    if (t.includes('analysis') || t.includes('prediction')) return <Cpu className="h-4.5 w-4.5 text-emerald-500" />;
    if (t.includes('report')) return <FileText className="h-4.5 w-4.5 text-pink-500" />;
    return <Bell className="h-4.5 w-4.5 text-indigo-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Notifications Center</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time status updates from AI prediction and scans pipeline.</p>
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-500"></div>
            <p className="text-xs text-slate-450 font-semibold font-sans">Compiling notification logs...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-450">
            <p className="text-sm font-semibold">No notifications compiled in this session.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4.5 border rounded-2xl flex items-start gap-4 transition-all ${item.read ? 'border-slate-100 bg-slate-50/20 dark:border-slate-800/40 dark:bg-transparent' : 'border-medical-500/20 bg-medical-500/5 dark:bg-medical-950/10'}`}
              >
                {/* Visual Icon */}
                <div className={`p-2.5 rounded-xl ${item.read ? 'bg-slate-100 dark:bg-slate-800' : 'bg-medical-500/10 dark:bg-medical-950'}`}>
                  {getIcon(item.title)}
                </div>

                {/* Body Content */}
                <div className="flex-1 text-left text-xs font-semibold">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">{item.message}</p>
                </div>

                {/* Mark as read action */}
                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-850 text-slate-500 hover:text-medical-500 rounded-lg shadow-sm transition-all flex-shrink-0"
                    title="Mark alert as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
