import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left text-xs font-semibold">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Privacy & Data Protection Policy</h2>
        <p className="text-xs text-slate-500 mt-1">Surgical scanning records protection standards and HIPAA guidelines.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5 border-b border-slate-150/40 pb-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Patient Confidentiality & HIPAA Standards</h3>
        </div>

        <p className="text-slate-550 leading-relaxed font-medium">
          The BAMP AI Treatment Evaluation portal complies with all relevant health insurance portability and privacy regulations (HIPAA). All medical images, cephalometric files, and patient demographic records are encrypted at rest and in transit.
        </p>

        <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Data Storage Boundaries</h4>
        <p className="text-slate-500 leading-relaxed font-medium">
          Scans and metrics datasets are stored inside secure Firebase cloud folders or localized database states. Technical support staff cannot view patient names without authorized clinical workspace elevation.
        </p>

        <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Encryption Configurations</h4>
        <p className="text-slate-500 leading-relaxed font-medium">
          Patient records utilize AES-256 data encryption routines. All Express REST API connections are secure (HTTPS/WSS) and validate identity using JWT auth tokens.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
