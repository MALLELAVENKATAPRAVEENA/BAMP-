import React from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Landmark, Cpu } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const About = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">About BAMP AI Platform</h2>
        <p className="text-xs text-slate-500 mt-1">Research background, skeletal indicators, and machine learning models definitions.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Bone Anchored Maxillary Protraction (BAMP)</h3>
        
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 font-medium">
          Bone Anchored Maxillary Protraction (BAMP), popularized by Hugo De Clerck, represents a paradigm shift in the orthopedic treatment of growing patients with Skeletal Class III malocclusion and maxillary hypoplasia. By utilizing four miniplates (two in the infrazygomatic crests of the maxilla and two in the anterior mandible) loaded with Class III intermaxillary elastics, BAMP delivers orthopedic force vectors directly to the circummaxillary sutures.
        </p>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-355 font-medium">
          Unlike standard facemasks, skeletal anchorage eliminates undesirable dental side effects such as upper incisor proclination or mandibular incisor retroclination. It allows continuous force loading (24 hours a day) during peak growth windows (ages 10-12), stimulating true skeletal maxillary advancement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs font-semibold">
          <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <Cpu className="h-6 w-6 text-medical-500" />
            <h4 className="font-bold">AI Predictive Models</h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">Analyzes SNA, SNB, FMA, Overjet, and cervical growth stage markers to score treatment prognosis.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <h4 className="font-bold">Verifiable Verification</h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">Ensures clinical records checks through cryptographically signed local PDF files and verification QR grids.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <Landmark className="h-6 w-6 text-indigo-500" />
            <h4 className="font-bold">Research Aggregation</h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">Enables multi-role database downloads to advance cephalometric statistical analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
