import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ZoomIn, Info, ShieldAlert, Cpu, BarChart, ChevronRight } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const ImageAnalysis = () => {
  const [activeTab, setActiveTab] = useState('segmented');
  const [zoom, setZoom] = useState(1);

  // Raw mock images represented as styled Canvas elements/SVGs to simulate complex filters
  const mockFilters = {
    original: {
      title: 'Original Scan',
      desc: 'Raw Lateral Cephalogram scan input.',
      score: '98.5%',
      svg: (
        <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-900">
          <path d="M50 100 C150 100, 200 40, 280 40 C320 40, 360 80, 380 120 C390 140, 380 200, 350 210 C320 220, 280 180, 250 250 C230 290, 200 290, 180 260 C160 230, 150 180, 120 180 Z" fill="none" stroke="#475569" strokeWidth="2" />
          <text x="30" y="40" fill="#475569" fontSize="10">Raw Contrast Grid</text>
        </svg>
      )
    },
    enhanced: {
      title: 'Enhanced Contrast',
      desc: 'CLAHE filter mapping skeletal margins.',
      score: '99.2%',
      svg: (
        <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-950">
          <path d="M50 100 C150 100, 200 40, 280 40 C320 40, 360 80, 380 120 C390 140, 380 200, 350 210 C320 220, 280 180, 250 250 C230 290, 200 290, 180 260 C160 230, 150 180, 120 180 Z" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
          <text x="30" y="40" fill="#0ea5e9" fontSize="10">Enhanced CLAHE Vector</text>
        </svg>
      )
    },
    segmented: {
      title: 'Structural Segmentation',
      desc: 'CNN model segmenting maxilla and mandible.',
      score: '94.8%',
      svg: (
        <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-900">
          {/* Skull base */}
          <path d="M50 100 C120 100, 160 50, 200 50" fill="none" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          {/* Maxilla in Teal */}
          <path d="M200 120 C240 120, 280 140, 300 180" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" />
          {/* Mandible in Indigo */}
          <path d="M220 220 C240 250, 280 280, 320 260" fill="none" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" />
          <text x="30" y="40" fill="#64748b" fontSize="10">Segmentation Channels [1-Maxilla, 2-Mandible]</text>
        </svg>
      )
    },
    heatmap: {
      title: 'Sutural Heatmap',
      desc: 'Confidence gradients surrounding cranial sutures.',
      score: '95.6%',
      svg: (
        <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-900">
          <circle cx="280" cy="140" r="30" fill="url(#radialGlow)" />
          <circle cx="240" cy="200" r="25" fill="url(#radialGlow)" />
          <path d="M50 100 C150 100, 200 40, 280 40" fill="none" stroke="#334155" strokeWidth="2" />
          <defs>
            <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <text x="30" y="40" fill="#f43f5e" fontSize="10">Anatomical Sutural Stress Zone</text>
        </svg>
      )
    },
    edges: {
      title: 'Craniofacial Edges',
      desc: 'Sobel-Canny edge outlines.',
      score: '97.4%',
      svg: (
        <svg viewBox="0 0 400 300" className="w-full h-full bg-black">
          <path d="M50 100 C150 100, 200 40, 280 40 C320 40, 360 80, 380 120" fill="none" stroke="#ffffff" strokeWidth="1" />
          <path d="M280 40 C320 40, 360 80, 380 120 C390 140, 380 200, 350 210" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
          <text x="30" y="40" fill="#ffffff" fontSize="10">Sobel Filter Outlines (Dx=1, Dy=1)</text>
        </svg>
      )
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Image Analysis Station</h2>
        <p className="text-xs text-slate-500 mt-1">Multi-viewport filtration system isolating skeletal tissues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Metric Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Analysis Channels</h3>
            
            {/* Navigation Tabs */}
            <div className="flex flex-col space-y-2">
              {Object.keys(mockFilters).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeTab === key ? 'bg-medical-500/10 border-medical-500 text-medical-600 dark:text-medical-400' : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
                >
                  {mockFilters[key].title}
                </button>
              ))}
            </div>

            {/* Quality specs */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4.5 rounded-2xl border border-slate-150/40 dark:border-slate-800 space-y-3.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Performance</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Image Quality Score</span>
                  <span className="text-emerald-500">97.8%</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Confidence Rating</span>
                  <span className="text-medical-500">94.5%</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Modality Resolution</span>
                  <span className="text-slate-400">1920 x 1080</span>
                </div>
              </div>
            </div>

          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center space-x-2 text-xs">
            <Info className="h-4.5 w-4.5 text-medical-500 flex-shrink-0" />
            <p className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold leading-normal">
              Filters isolate critical landmarks from background soft tissues during training steps.
            </p>
          </div>
        </div>

        {/* Viewport Display Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          
          {/* Viewport Controls */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-805/85 pb-4 mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{mockFilters[activeTab].title}</h4>
              <p className="text-[10px] text-slate-400 font-medium">{mockFilters[activeTab].desc}</p>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                Sutural Match: {mockFilters[activeTab].score}
              </span>
              <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><ZoomIn className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Viewport Canvas container */}
          <div className="relative border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-slate-950/95 max-h-[400px]">
            <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s ease', width: '100%', height: '100%' }}>
              {mockFilters[activeTab].svg}
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[10px] text-slate-450 font-semibold">
            <span>Filter Index: {activeTab.toUpperCase()}</span>
            <span>Target Pipeline: Preprocessing &rarr; Filter &rarr; Segment</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ImageAnalysis;
