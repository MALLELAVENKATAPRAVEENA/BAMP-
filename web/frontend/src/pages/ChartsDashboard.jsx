import React from 'react';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import GlassmorphicCard from '../components/GlassmorphicCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend);

const ChartsDashboard = () => {
  const patientTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Scans Evaluated',
        data: [18, 25, 30, 42, 38, 48],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const parametersRadar = {
    labels: ['SNA', 'SNB', 'ANB', 'FMA', 'Wits', 'Overjet'],
    datasets: [
      {
        label: 'Case Sample Means',
        data: [78, 80, -2, 23, -3, -1.5],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left text-xs font-semibold">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Charts Analytics Station</h2>
        <p className="text-xs text-slate-500 mt-1">Craniofacial trends plots and algorithm telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassmorphicCard hoverEffect={false} className="p-5 bg-white dark:bg-slate-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550 mb-4">Patient Volume Trends</h3>
          <div className="h-64">
            <Line data={patientTrend} options={{ maintainAspectRatio: false }} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={false} className="p-5 bg-white dark:bg-slate-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550 mb-4">Skeletal Vector Profiles</h3>
          <div className="h-64 flex items-center justify-center">
            <Radar data={parametersRadar} options={{ maintainAspectRatio: false }} />
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
};

export default ChartsDashboard;
