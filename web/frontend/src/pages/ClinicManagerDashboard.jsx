import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Stethoscope, Landmark, Calendar, Clock, 
  TrendingUp, BarChart3, Plus, Bell, CheckCircle2, ChevronRight 
} from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ClinicManagerDashboard = () => {
  const [doctors, setDoctors] = useState([
    { name: 'Dr. Venkatapraveenamallela', patientsToday: 3, status: 'Active', specialty: 'Orthodontics' },
    { name: 'Dr. Sarah Connor', patientsToday: 2, status: 'In Surgery', specialty: 'Oral Surgery' },
    { name: 'Dr. Michael Smith', patientsToday: 4, status: 'Active', specialty: 'General Dentistry' }
  ]);

  const [appointments, setAppointments] = useState([
    { time: '09:00 AM', patient: 'Aarav Sharma', doctor: 'Dr. Venkatapraveenamallela', type: 'BAMP Fitting', status: 'Checked In' },
    { time: '10:30 AM', patient: 'Priya Patel', doctor: 'Dr. Venkatapraveenamallela', type: 'Cephalometric Scan', status: 'In Progress' },
    { time: '01:00 PM', patient: 'Rohan Das', doctor: 'Dr. Sarah Connor', type: 'Miniplate Surgery', status: 'Confirmed' }
  ]);

  // Caseload distribution chart
  const caseLoadData = {
    labels: ['Orthodontics', 'Oral Surgery', 'General Dentistry'],
    datasets: [
      {
        data: [12, 5, 8],
        backgroundColor: ['#0ea5e9', '#6366f1', '#14b8a6'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-extrabold font-sans">Clinic Operations Center</h2>
        <p className="text-slate-200 mt-2 text-sm max-w-xl font-medium">
          Welcome Clinic Manager. Platform status checks denote all scanning devices and doctor databases are operational.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Orthodontists</span>
          <h3 className="text-xl font-bold mt-4">3 Doctors</h3>
        </GlassmorphicCard>
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Support Staff</span>
          <h3 className="text-xl font-bold mt-4">8 Members</h3>
        </GlassmorphicCard>
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Appointments Today</span>
          <h3 className="text-xl font-bold mt-4">9 Bookings</h3>
        </GlassmorphicCard>
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Device Load Factor</span>
          <h3 className="text-xl font-bold mt-4 text-emerald-500">Low (14%)</h3>
        </GlassmorphicCard>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center space-x-2">
            <Calendar className="h-4.5 w-4.5 text-indigo-500" />
            <span>Today's Appointment Log</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">assigned Specialist</th>
                  <th className="pb-3">Modality Type</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((apt, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30">
                    <td className="py-3 font-mono">{apt.time}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-100">{apt.patient}</td>
                    <td className="py-3 text-slate-500">{apt.doctor}</td>
                    <td className="py-3">{apt.type}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${apt.status === 'Checked In' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20' : apt.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor caselods Doughnut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center space-x-2">
              <BarChart3 className="h-4.5 w-4.5 text-medical-500" />
              <span>Department Case-loads</span>
            </h3>
            <div className="h-48 flex items-center justify-center">
              <Doughnut data={caseLoadData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Staff Status</h4>
            <div className="space-y-3 mt-3 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span>Dr. Venkatapraveenamallela</span>
                <span className="text-emerald-500">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Radiologist Desk</span>
                <span className="text-emerald-500">Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ClinicManagerDashboard;
