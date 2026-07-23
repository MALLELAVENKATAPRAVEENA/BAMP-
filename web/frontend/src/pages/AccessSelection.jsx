import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, ShieldCheck, Database, Landmark, UserCheck } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { useAuth } from '../context/AuthContext';

const AccessSelection = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleRoleSelect = (role) => {
    if (role === 'Orthodontist') {
      navigate('/dashboard');
    } else if (role === 'Clinic Manager') {
      navigate('/clinic-manager-dashboard');
    } else if (role === 'Researcher') {
      navigate('/research-dashboard');
    }
  };

  const roles = [
    {
      name: 'Orthodontist',
      title: 'Clinical Orthodontist',
      desc: 'Register patients, upload craniofacial X-Rays, verify auto-landmarks, run AI evaluations, and write signed clinical reports.',
      icon: Stethoscope,
      color: 'text-medical-500 bg-medical-500/10 border-medical-500/20 hover:border-medical-500',
      badge: 'Clinician'
    },
    {
      name: 'Clinic Manager',
      title: 'Clinic Operations Manager',
      desc: 'Monitor hospital KPIs, check doctor queues, verify appointments, analyze staff allocations, and review diagnostic throughput.',
      icon: Landmark,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500',
      badge: 'Manager'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-darkbg dark:text-slate-100 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-medical-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 text-center">
        <h2 className="text-3xl font-extrabold font-sans tracking-tight">Select Access Level</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Choose your active workstation to launch corresponding clinical matrices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
          {roles.map((r, i) => (
            <GlassmorphicCard
              key={i}
              onClick={() => handleRoleSelect(r.name)}
              className={`flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/80 cursor-pointer group border ${r.color} transition-all`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl transition-all duration-200">
                    <r.icon className="h-7 w-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {r.badge}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mt-5 group-hover:text-medical-500 transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-2.5 leading-relaxed">
                  {r.desc}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-medical-600 dark:text-medical-400 group-hover:underline">
                <span>Enter Workstation</span>
              </div>
            </GlassmorphicCard>
          ))}
        </div>

        <p className="mt-10 text-xs text-slate-500">
          Logged in as <span className="font-semibold">{user?.name || 'Dr. Venkatapraveenamallela'}</span>. Need a different account?{' '}
          <button onClick={() => { logout(); navigate('/login'); }} className="underline hover:text-medical-500 font-semibold">Log out</button>
        </p>
      </div>
    </div>
  );
};

export default AccessSelection;
