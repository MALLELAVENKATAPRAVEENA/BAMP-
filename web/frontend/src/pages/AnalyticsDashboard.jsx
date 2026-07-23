import React from 'react';
import { Bar } from 'react-chartjs-2';
import { BarChart, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const AnalyticsDashboard = () => {
  const modelComparisons = {
    labels: ['Random Forest', 'XGBoost', 'SVM', 'Logistic Regression'],
    datasets: [
      {
        label: 'Accuracy Rating (%)',
        data: [94.6, 93.2, 91.8, 88.5],
        backgroundColor: ['#14b8a6', '#0ea5e9', '#6366f1', '#a855f7']
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left text-xs font-semibold">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Analytics Telemetry</h2>
        <p className="text-xs text-slate-500 mt-1">Operational matrices, model accuracy indexes, and system delays tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Cards */}
        <div className="md:col-span-1 space-y-4">
          <GlassmorphicCard className="p-4 flex items-center space-x-3 bg-white dark:bg-slate-900">
            <div className="p-3 bg-teal-500/10 text-teal-500 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classification Confidence</p>
              <h4 className="text-lg font-bold text-slate-850 dark:text-slate-200 mt-1">94.6% Avg</h4>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4 flex items-center space-x-3 bg-white dark:bg-slate-900">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inference Delay</p>
              <h4 className="text-lg font-bold text-slate-855 dark:text-slate-205 mt-1">380 ms</h4>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4 flex items-center space-x-3 bg-white dark:bg-slate-900">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Relapse Risk Threshold</p>
              <h4 className="text-lg font-bold text-slate-855 dark:text-slate-205 mt-1">FMA &gt; 30°</h4>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Model Chart */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550 mb-4">Algorithm Accuracies Comparison</h3>
          <div className="h-64">
            <Bar data={modelComparisons} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
