import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4.5 bg-rose-500/10 text-rose-500 rounded-3xl mb-6 border border-rose-500/20">
        <ShieldAlert className="h-10 w-10 animate-bounce" />
      </div>

      <h1 className="text-4xl font-extrabold font-sans text-slate-800 dark:text-slate-100">404 - Workstation Offline</h1>
      <p className="text-xs text-slate-400 mt-2.5 max-w-sm leading-normal">
        The requested routing parameters are not registered. Check the path url or return to dashboard.
      </p>

      <button
        onClick={() => navigate('/access-selection')}
        className="mt-8 inline-flex items-center space-x-1.5 px-6 py-3 bg-medical-500 hover:bg-medical-400 text-white font-bold rounded-2xl text-xs shadow-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Station Selection</span>
      </button>
    </div>
  );
};

export default NotFound;
