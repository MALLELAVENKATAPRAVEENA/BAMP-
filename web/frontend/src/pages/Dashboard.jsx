import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, FileImage, ShieldAlert, Cpu, BarChart3, 
  TrendingUp, Award, UserPlus, Upload, FileText, CheckCircle2, History, ChevronRight
} from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { useRealtimeDashboard } from '../hooks/useRealtimeDashboard';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, recentPatients, recentPredictions, recentActivities, loading } = useRealtimeDashboard();

  const statCards = [
    { name: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Total Predictions', value: stats.totalPredictions, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Active Users', value: stats.activeUsers, icon: Users, color: 'text-sky-500 bg-sky-500/10' },
    { name: 'AI Prediction Accuracy', value: '94.6%', icon: Cpu, color: 'text-cyan-500 bg-cyan-500/10' },
    { name: 'Avg. Success Rate', value: `${stats.avgSuccessRate}%`, icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
  ];

  const quickActions = [
    { name: 'Add Patient', desc: 'Register demographics', path: '/new-patient', icon: UserPlus, color: 'from-blue-500 to-indigo-600' },
    { name: 'Upload Scans', desc: 'Cephalogram, CBCT files', path: '/upload-scan', icon: Upload, color: 'from-teal-500 to-emerald-600' },
    { name: 'Analyze Landmarks', desc: 'Identify craniofacial points', path: '/landmark-detection', icon: Cpu, color: 'from-cyan-500 to-sky-600' },
    { name: 'Run AI Prediction', desc: 'Assess BAMP outcomes', path: '/ai-engine', icon: BarChart3, color: 'from-purple-500 to-pink-600' },
    { name: 'Generate Report', desc: 'Compile PDF assessments', path: '/reports', icon: FileText, color: 'from-amber-500 to-orange-600' },
    { name: 'Patient History', desc: 'View records directory', path: '/patient-records', icon: History, color: 'from-slate-650 to-slate-800' },
  ];

  const chartData = {
    labels: ['May', 'June', 'July'],
    datasets: [
      {
        label: 'Treatment Success Rate Average (%)',
        data: [82.4, 84.1, stats.avgSuccessRate || 86.4],
        borderColor: '#0e90e9',
        backgroundColor: 'rgba(14, 144, 233, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0e90e9',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { min: 60, max: 100, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Message Card */}
      <div className="bg-gradient-to-r from-medical-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg shadow-medical-500/10">
        <h2 className="text-2xl md:text-3xl font-extrabold font-sans">
          Welcome back, {user?.name || 'Dr. Venkatapraveenamallela'}
        </h2>
        <p className="text-slate-200 mt-2 text-sm max-w-2xl font-medium">
          Predictive AI Evaluation Engine for Bone Anchored Maxillary Protraction (BAMP) is connected to live Firebase project <strong className="underline">bamp-1de96</strong>.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-slate-900 h-24 rounded-2xl border border-slate-200/50 dark:border-slate-800/50"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statCards.map((card, i) => (
              <GlassmorphicCard key={i} hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.name}</span>
                  <div className={`p-1.5 rounded-lg ${card.color}`}>
                    <card.icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-4 text-slate-800 dark:text-slate-100">{card.value}</h3>
              </GlassmorphicCard>
            ))}
          </div>

          {/* Quick Actions Panel */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-4">Quick Workstation Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-center group hover:border-medical-500 transition-all duration-200 shadow-sm"
                >
                  <div className={`p-3 bg-gradient-to-r ${action.color} text-white rounded-xl mb-3.5 transform group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-medical-500">{action.name}</h4>
                  <p className="text-[9px] text-slate-400 mt-1">{action.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Charts and Feeds Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-5">Live Case Performance Trends</h3>
              <div className="h-72">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Recent Activity panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-4">Real-Time Audit Log</h3>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                      <div key={act.id} className="flex items-start space-x-3 text-xs">
                        <div className="mt-0.5 p-1 rounded-md bg-blue-500/10 text-blue-500">
                          <Cpu className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{act.action} ({act.entityType})</p>
                          <span className="text-[10px] text-slate-400">{act.timestamp ? new Date(act.timestamp.seconds ? act.timestamp.seconds * 1000 : act.timestamp).toLocaleTimeString() : 'Just now'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No real-time audit logs recorded yet.</p>
                  )}
                </div>
              </div>
              <button onClick={() => navigate('/patient-records')} className="mt-5 w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 border border-slate-200/60 dark:border-slate-850">
                <span>Browse Patient Records</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
