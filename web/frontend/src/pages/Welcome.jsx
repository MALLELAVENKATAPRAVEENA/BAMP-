import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-900 text-white">
      {/* Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-medical-600/20 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] rounded-full bg-cyan-500/5 blur-[150px]"></div>

      {/* Floating Abstract Mesh Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="z-10 max-w-4xl w-full text-center">
        {/* Animated Medical Header Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center p-4 bg-medical-500/10 border border-medical-500/30 rounded-3xl mb-6 backdrop-blur-md"
        >
          <Activity className="h-10 w-10 text-medical-400 animate-pulse" />
        </motion.div>

        {/* Title and Subtitle Block */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-medical-300 font-sans leading-tight"
        >
          Welcome to BAMP AI TREATMENT
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          AI-Based Prediction System for Successful Bone Anchored Maxillary Protraction (BAMP) Treatment Outcomes in Class III Skeletal Malocclusion with Maxillary Hypoplasia.
        </motion.p>

        {/* Floating Metrics Showcase */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left"
        >
          <GlassmorphicCard hoverEffect={false} className="bg-slate-950/40 border-white/5 p-5">
            <Cpu className="h-7 w-7 text-medical-400 mb-3" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cephalometric AI</h3>
            <p className="text-xs text-slate-400 mt-1">Automatic landmark tracking and skeletal angle calculations in seconds.</p>
          </GlassmorphicCard>

          <GlassmorphicCard hoverEffect={false} className="bg-slate-950/40 border-white/5 p-5">
            <Activity className="h-7 w-7 text-cyan-400 mb-3" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Predictive Outcomes</h3>
            <p className="text-xs text-slate-400 mt-1">Clinical success assessment using patient growth and skeletal morphology indexes.</p>
          </GlassmorphicCard>

          <GlassmorphicCard hoverEffect={false} className="bg-slate-950/40 border-white/5 p-5">
            <ShieldAlert className="h-7 w-7 text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Secure Reports</h3>
            <p className="text-xs text-slate-400 mt-1">Cryptographically verifiable QR reports and orthodontist digital signatures.</p>
          </GlassmorphicCard>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-12"
        >
          <button
            onClick={() => navigate('/login')}
            className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-medical-500 to-indigo-600 hover:from-medical-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span>Enter Evaluation Portal</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <p className="mt-8 text-xs text-slate-500">
          Designed for Qualified Orthodontists and Craniofacial Specialists. Authorized access only.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
