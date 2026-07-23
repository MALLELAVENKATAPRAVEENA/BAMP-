import React from 'react';
import { HelpCircle, PlayCircle, BookOpen, AlertCircle } from 'lucide-react';

const HelpCenter = () => {
  const guides = [
    {
      title: 'How to Register Patients',
      desc: 'Access the "New Patient" station. Enter personal details (Age, Gender) and current diagnoses. Save the record in the cloud directory.',
      icon: BookOpen
    },
    {
      title: 'How to Calibrate Landmarks',
      desc: 'Upload a lateral cephalogram. On the Landmark Calibration screen, click and drag the blue landmark markers to reposition. Guide lines and angles recalculate instantly.',
      icon: PlayCircle
    },
    {
      title: 'How to Export CSV Data',
      desc: 'For researchers: go to the Research workstation dashboard. Click the "Export Clinical CSV" button to download spreadsheet databases.',
      icon: HelpCircle
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left text-xs font-semibold">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Help & Support Center</h2>
        <p className="text-xs text-slate-500 mt-1">Operational guides and systems manuals for BAMP AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((g, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="p-3 bg-medical-500/10 text-medical-600 dark:text-medical-400 rounded-2xl w-fit">
              <g.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{g.title}</h3>
            <p className="text-slate-500 dark:text-slate-450 leading-relaxed font-medium">{g.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900 p-5 rounded-3xl flex items-start space-x-3 text-xs">
        <AlertCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-indigo-800 dark:text-indigo-400">System Accuracy Calibration Warning</h4>
          <p className="text-indigo-700 dark:text-indigo-455 leading-relaxed mt-1 font-semibold">
            Cephalometric Guide Lines are mathematical models. Specialists should verify miniplates anatomical markers stability physically prior to loading heavy orthodontic forces.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
