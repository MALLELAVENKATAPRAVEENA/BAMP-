import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Cpu, TrendingUp, BarChart3, ScatterChart, FileText } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ResearcherDashboard = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = () => {
    setIsExporting(true);
    toast.info("Assembling research CSV directory...");
    setTimeout(() => {
      window.open('/api/research/export', '_blank');
      setIsExporting(false);
      toast.success("CSV database exported successfully.");
    }, 1200);
  };

  // Demographics metrics
  const ageData = {
    labels: ['Age 8-9', 'Age 10-11', 'Age 12-13', 'Age 14-15', 'Age 16+'],
    datasets: [
      {
        label: 'Clinical Trial Distributions',
        data: [15, 68, 54, 18, 5],
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#14b8a6'
      }
    ]
  };

  const genderData = {
    labels: ['Male Patients', 'Female Patients'],
    datasets: [
      {
        data: [72, 88],
        backgroundColor: ['#0ea5e9', '#ec4899'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-sans">Research & Analytics Station</h2>
          <p className="text-teal-100 mt-2 text-sm max-w-xl font-medium">
            Review BAMP skeletal response statistics and export clinical databases for meta-analyses.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white text-teal-700 hover:bg-slate-100 font-bold rounded-2xl text-xs transition-all shadow-sm flex-shrink-0 disabled:opacity-50"
        >
          <Download className="h-4.5 w-4.5" />
          <span>Export Clinical CSV</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patients Databases Size</span>
          <h3 className="text-xl font-bold mt-4">160 Cases</h3>
        </GlassmorphicCard>
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Predictions Run</span>
          <h3 className="text-xl font-bold mt-4">148 Runs</h3>
        </GlassmorphicCard>
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classifier Kernel</span>
          <h3 className="text-xl font-bold mt-4">Random Forest</h3>
        </GlassmorphicCard>
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verification Accuracy</span>
          <h3 className="text-xl font-bold mt-4 text-teal-500">94.6%</h3>
        </GlassmorphicCard>
      </div>

      {/* Charts splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Age distribution Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center space-x-2">
            <TrendingUp className="h-4.5 w-4.5 text-teal-550" />
            <span>Age Distribution peak Response Grid</span>
          </h3>
          <div className="h-64">
            <Line data={ageData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Gender distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center space-x-2">
              <BarChart3 className="h-4.5 w-4.5 text-medical-500" />
              <span>Gender Distribution</span>
            </h3>
            <div className="h-48 flex items-center justify-center">
              <Pie data={genderData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Research Database Details</h4>
            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
              Contains records mapping ANB, Wits, Overjet, and FMA angles vs final maxillary advancement vectors post-protraction.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ResearcherDashboard;
