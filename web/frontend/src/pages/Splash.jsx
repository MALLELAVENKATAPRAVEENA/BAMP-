import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Splash = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/access-selection');
      } else {
        navigate('/welcome');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden text-white">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-medical-500/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="z-10 flex flex-col items-center space-y-6">
        
        {/* Animated Pulsing Medical Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="p-5 bg-medical-500/10 border border-medical-500/20 rounded-full shadow-lg shadow-medical-500/5"
        >
          <Activity className="h-16 w-16 text-medical-450 animate-pulse" />
        </motion.div>

        {/* Title */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-extrabold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-white to-medical-300"
          >
            BAMP AI
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xs text-slate-400 font-medium tracking-widest uppercase"
          >
            Predictive Orthodontic Platform
          </motion.p>
        </div>

        {/* Progress Bar Loading */}
        <div className="w-48 bg-slate-800 h-1 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="bg-medical-500 absolute top-0 bottom-0 w-1/2 rounded-full"
          ></motion.div>
        </div>

      </div>
      
      <div className="absolute bottom-10 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        Authorized Clinical Access Only
      </div>
    </div>
  );
};

export default Splash;
