import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Stethoscope, Calendar, Clock, 
  TrendingUp, BarChart3, Plus, Bell, CheckCircle2, ChevronRight,
  Activity, Package, ShieldCheck, DollarSign, Layers
} from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ClinicManagerDashboard = () => {
  const [chairStatus, setChairStatus] = useState([
    { bay: 'Bay 1 (Orthodontics)', doctor: 'Dr. Venkatapraveenamallela', patient: 'Aarav Sharma', procedure: 'BAMP Elastic Engagement', status: 'In Treatment', occupancy: 'Occupied' },
    { bay: 'Bay 2 (Oral Surgery)', doctor: 'Dr. Sarah Connor', patient: 'Rohan Das', procedure: 'Miniplate Anchor Placement', status: 'Surgical Prep', occupancy: 'Occupied' },
    { bay: 'Bay 3 (Hygiene Bay)', doctor: 'Staff Nurse Ananya', patient: 'Priya Patel', procedure: 'Cephalometric Impression', status: 'In Use', occupancy: 'Occupied' },
    { bay: 'Bay 4 (X-Ray Suite)', doctor: 'Lab Tech Rajesh', patient: 'Cleaning & Sterilization', procedure: 'Cephalostat Calibration', status: 'Available', occupancy: 'Open' }
  ]);

  const [inventory, setInventory] = useState([
    { item: 'BAMP Maxillary Miniplate Kits', stock: '14 Kits', status: 'Sufficient' },
    { item: 'Intermaxillary Latex Elastics (3/16")', stock: '42 Packs', status: 'Optimal' },
    { item: 'Mandibular Bone Anchor Screws (2.0mm)', stock: '8 Packs', status: 'Reorder Soon' },
    { item: 'Cephalometric Sensor Calibration Plates', stock: '5 Units', status: 'Sufficient' }
  ]);

  const caseLoadData = {
    labels: ['BAMP Protraction', 'Cephalometrics', 'Surgical Anchorage', 'General Consultation'],
    datasets: [
      {
        label: 'Active Cases',
        data: [18, 12, 7, 9],
        backgroundColor: ['#0ea5e9', '#6366f1', '#14b8a6', '#f59e0b'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* Operations Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white rounded-3xl p-6 md:p-8 shadow-lg shadow-indigo-500/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-sans">Clinic Operations & Management Center</h2>
            <p className="text-indigo-100 mt-2 text-xs md:text-sm max-w-xl font-medium">
              Real-time monitoring of treatment bay occupancy, specialist staff rosters, appliance inventory, and daily clinical workflow.
            </p>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Operations Live: 3/4 Treatment Bays Occupied</span>
          </div>
        </div>
      </div>

      {/* Operational KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today's Total Patients</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black mt-3">28 Patients</h3>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-teal-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chair Occupancy Rate</span>
            <Activity className="h-4 w-4 text-teal-500" />
          </div>
          <h3 className="text-2xl font-black mt-3 text-emerald-500">75% (3/4 Bays)</h3>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-amber-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Appliance Orders Pending</span>
            <Package className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black mt-3 text-amber-500">4 Miniplate Kits</h3>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">On-Duty Specialists</span>
            <Stethoscope className="h-4 w-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-black mt-3">5 Staff Members</h3>
        </GlassmorphicCard>
      </div>

      {/* Main Operational Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Treatment Bay & Chair Status Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="h-4.5 w-4.5 text-indigo-500" />
              <span>Treatment Bay & Chair Occupancy Live Matrix</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Updated just now</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Bay / Suite</th>
                  <th className="pb-3">Assigned Specialist</th>
                  <th className="pb-3">Patient / Active Procedure</th>
                  <th className="pb-3 text-right">Bay Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chairStatus.map((chair, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">{chair.bay}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{chair.doctor}</td>
                    <td className="py-3.5">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-200">{chair.patient}</p>
                        <p className="text-[10px] text-slate-400">{chair.procedure}</p>
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${chair.occupancy === 'Occupied' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'}`}>
                        {chair.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appliance Inventory & Stock Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Package className="h-4.5 w-4.5 text-teal-500" />
              <span>Appliance Inventory & Stock</span>
            </h3>

            <div className="space-y-3.5 text-xs font-semibold">
              {inventory.map((inv, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{inv.item}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Stock: {inv.stock}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${inv.status === 'Reorder Soon' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Case Distribution</h4>
            <div className="h-36 mt-2 flex items-center justify-center">
              <Doughnut data={caseLoadData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ClinicManagerDashboard;
