import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Sparkles, Eye, ShieldAlert, Cpu, 
  MapPin, Network, Activity, TrendingUp, HeartHandshake, CheckCircle2, ChevronRight
} from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const ImagingPipeline = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: 'Image Upload', desc: 'Ingestion of cephalogram X-Rays or CBCT slices.', icon: Upload, detail: 'Validating format and pixel grid limits.' },
    { name: 'Image Enhancement', desc: 'Preprocessing raw dental scans.', icon: Sparkles, detail: 'Histogram equalizations and pixel corrections.' },
    { name: 'Noise Removal', desc: 'Improving image clarity.', icon: ShieldAlert, detail: 'Gaussian filters smoothing cranial contours.' },
    { name: 'Contrast Enhancement', desc: 'Highlighting skeletal margins.', icon: Eye, detail: 'Adaptive CLAHE highlighting bone landmarks.' },
    { name: 'Image Segmentation', desc: 'Isolating jaw and dental structures.', icon: Network, detail: 'Delineating maxilla and mandible margins.' },
    { name: 'Landmark Detection', desc: 'Pinpoint anatomical points.', icon: MapPin, detail: 'Finding Sella, Nasion, Point A, Point B, etc.' },
    { name: 'Feature Extraction', desc: 'Calculating spatial vectors.', icon: Cpu, detail: 'Extracting distances and mandibular ratios.' },
    { name: 'Cephalometric Angles', desc: 'Trigonometric calculations.', icon: Activity, detail: 'Measuring SNA, SNB, ANB, Wits, FMA angles.' },
    { name: 'AI Prediction', desc: 'ML success outcome prediction.', icon: TrendingUp, detail: 'Assessing success probability and risk level.' },
    { name: 'Clinical Recommendation', desc: 'Compiling guidelines.', icon: HeartHandshake, detail: 'Formulating elastics vectors and anchorage force guidelines.' },
    { name: 'Final Report Generation', desc: 'Digital PDF synthesis.', icon: CheckCircle2, detail: 'Generating signing certificates and QR codes.' }
  ];

  // Auto-play steps loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">AI Imaging Pipeline</h2>
        <p className="text-xs text-slate-500 mt-1">Real-time status tracking of craniofacial analysis workflow processes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side Details panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div>
            <span className="text-[10px] font-bold text-medical-600 bg-medical-50 dark:bg-medical-950/40 dark:text-medical-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step {activeStep + 1} of {steps.length}
            </span>
            <h3 className="text-lg font-bold mt-4 flex items-center space-x-2 text-slate-850 dark:text-slate-200">
              {React.createElement(steps[activeStep].icon, { className: "h-5 w-5 text-medical-500" })}
              <span>{steps[activeStep].name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3.5 leading-relaxed">
              {steps[activeStep].desc}
            </p>
            <div className="mt-6 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sub-process Detail</h4>
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1">{steps[activeStep].detail}</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-medium">
            * Pipeline progresses automatically. Select any step on the right map to focus detail manually.
          </div>
        </div>

        {/* Right Side Connected workflow map */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col space-y-3">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${isActive ? 'bg-medical-500/10 border-medical-500 scale-[1.01] shadow-sm' : isPassed ? 'border-slate-100 bg-slate-50/20 dark:bg-slate-900/35 dark:border-slate-850' : 'border-slate-100 dark:border-slate-850'}`}
                >
                  {/* Step index badge */}
                  <div className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs mr-4 transition-all duration-200 ${isActive ? 'bg-medical-500 text-white' : isPassed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-550 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {isPassed ? <CheckCircle2 className="h-4.5 w-4.5" /> : idx + 1}
                  </div>

                  {/* Step information */}
                  <div className="flex-1">
                    <h4 className={`text-xs font-bold transition-colors ${isActive ? 'text-medical-600 dark:text-medical-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {step.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate max-w-md">{step.desc}</p>
                  </div>

                  {/* Chevron indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="text-medical-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImagingPipeline;
