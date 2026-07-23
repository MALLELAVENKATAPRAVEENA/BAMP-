import React from 'react';
import { FileText, Award } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left text-xs font-semibold">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Terms & Conditions of Use</h2>
        <p className="text-xs text-slate-500 mt-1">Specialist agreements and professional usage liabilities.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5 border-b border-slate-150/40 pb-3">
          <FileText className="h-5 w-5 text-indigo-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Clinical Responsibility & AI Accuracy</h3>
        </div>

        <p className="text-slate-550 leading-relaxed font-medium">
          By launching BAMP AI Workstations, you acknowledge and agree that predictions are mathematical model probabilities designed to support craniofacial evaluations. The final surgical and orthopaedic plan remains the sole professional responsibility of the qualified orthodontist.
        </p>

        <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Workstation License</h4>
        <p className="text-slate-500 leading-relaxed font-medium">
          Access is limited to authorized orthodontists, clinic managers, and researchers. Sharing credentials or using the platform for non-orthodontic purposes is strictly prohibited.
        </p>

        <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Verification Accuracy Disclaimer</h4>
        <p className="text-slate-500 leading-relaxed font-medium">
          The software is provided "as is". The developers are not liable for deviations in actual miniplates osseointegration rates or surgical shifts during treatment.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
