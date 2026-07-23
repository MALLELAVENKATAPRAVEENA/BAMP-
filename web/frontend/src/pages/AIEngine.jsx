import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Play, CheckCircle2, ChevronRight, RefreshCw, Terminal } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AIEngine = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [logs, setLogs] = useState([]);

  const pipelineSteps = [
    { name: 'Image Ingestion', log: 'Parsing lateral cephalogram file data...' },
    { name: 'Noise Reduction', log: 'Applying Gaussian contours filtering...' },
    { name: 'Contrast Adjustment', log: 'Histogram equalization and CLAHE optimization...' },
    { name: 'Segmentation', log: 'Delineating maxilla and mandible margins...' },
    { name: 'Landmark Extraction', log: 'Locating Nasion, Sella, Point A, Point B coordinates...' },
    { name: 'Vector Measurements', log: 'Calculating SNA, SNB, ANB and FMA angles...' },
    { name: 'Outcome Modelling', log: 'Scoring clinical parameters vs growth patterns database...' },
    { name: 'Recommendation Synth', log: 'Formulating elastics vectors and anchorage force guidelines...' },
    { name: 'Report Compilation', log: 'Synthesizing signing certificate and secure QR code...' }
  ];

  const handleStartRun = () => {
    setIsRunning(true);
    setProgress(0);
    setActiveStepIdx(0);
    setLogs(['[SYSTEM] Initializing BAMP Evaluation Engine...']);
  };

  useEffect(() => {
    if (!isRunning) return;

    const totalSteps = pipelineSteps.length;
    const intervalTime = 1200; // Duration per step

    const stepInterval = setInterval(() => {
      setActiveStepIdx((prev) => {
        if (prev >= totalSteps - 1) {
          clearInterval(stepInterval);
          setProgress(100);
          setLogs((l) => [...l, '[SYSTEM] Execution Complete. Redirecting to Treatment Outcomes.']);
          setTimeout(() => {
            toast.success('BAMP success outcome prediction generated!');
            navigate('/ai-outcomes');
          }, 1500);
          return prev;
        }

        const nextStepIdx = prev + 1;
        const currentProgress = Math.round((nextStepIdx / totalSteps) * 100);
        
        setProgress(currentProgress);
        setLogs((l) => [
          ...l,
          `[OK] Completed step ${prev + 1}: ${pipelineSteps[prev].name}`,
          `[RUNNING] ${pipelineSteps[nextStepIdx].log}`
        ]);
        
        return nextStepIdx;
      });
    }, intervalTime);

    return () => clearInterval(stepInterval);
  }, [isRunning]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">BAMP AI Evaluation Engine</h2>
        <p className="text-xs text-slate-500 mt-1">Skeletal Class III prediction calculations station.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Run Panel / Dial */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[350px]">
          
          <div className="space-y-3 w-full">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Engine Calibration</h3>
            
            {/* Visual Circular Progress Tracker */}
            <div className="relative h-40 w-40 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="rgba(14, 144, 233, 0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#0e90e9"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * progress) / 100}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold tracking-tight">{progress}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Evaluated</span>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          {!isRunning ? (
            <button
              onClick={handleStartRun}
              className="w-full py-4 bg-gradient-to-r from-medical-500 to-indigo-600 hover:from-medical-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="h-4.5 w-4.5" />
              <span>Launch AI Engine</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-center space-x-2.5 py-4 text-xs font-bold text-medical-500">
              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              <span>Running Evaluation...</span>
            </div>
          )}

        </div>

        {/* Diagnostic Logs console */}
        <div className="md:col-span-2 bg-slate-950 text-slate-200 font-mono rounded-3xl p-6 shadow-sm border border-slate-900 flex flex-col justify-between h-[350px]">
          
          <div className="space-y-4 overflow-y-auto flex-1 scrollbar-thin text-xs text-left">
            <div className="flex items-center space-x-2 text-slate-400 border-b border-slate-900 pb-2 mb-2 font-bold uppercase tracking-wider">
              <Terminal className="h-4 w-4" />
              <span>System Output Logs Console</span>
            </div>
            
            <div className="space-y-1.5 font-semibold">
              {logs.map((log, idx) => (
                <div key={idx} className={log.startsWith('[SYSTEM]') ? 'text-medical-400' : log.startsWith('[RUNNING]') ? 'text-indigo-400 animate-pulse' : 'text-emerald-400'}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 mt-4 border-t border-slate-900 pt-2 text-right">
            Active Core: BAMP-Net v2.4 | System Safe Tiers Active
          </div>

        </div>

      </div>
    </div>
  );
};

export default AIEngine;
