import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Stethoscope, Calendar, Clock, 
  TrendingUp, BarChart3, Plus, Bell, CheckCircle2, ChevronRight,
  Activity, Package, ShieldCheck, DollarSign, Layers, Search, Eye, X, Filter, UserCheck, Landmark
} from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ClinicManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Real-time state from Firestore
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  // Fallback demo doctors if Firestore has no user docs yet
  const defaultDoctors = [
    {
      uid: 'doc-001',
      name: user?.name || 'Dr. Venkatapraveenamallela',
      email: user?.email || 'dr.venkat@hospital.org',
      role: 'Orthodontist',
      specialization: 'Orthodontics & Dentofacial Orthopedics',
      hospitalName: 'Advanced Orthodontic Care & AI Research Center',
      isActive: true,
      lastLogin: new Date().toISOString()
    },
    {
      uid: 'doc-002',
      name: 'Dr. Sarah Connor',
      email: 'dr.sarah@orthoclinic.com',
      role: 'Orthodontist',
      specialization: 'Craniofacial Surgical Orthodontics',
      hospitalName: 'Metropolitan Dental Hospital',
      isActive: true,
      lastLogin: new Date(Date.now() - 3600000).toISOString()
    },
    {
      uid: 'doc-003',
      name: 'Dr. Rajesh Kumar',
      email: 'dr.rajesh@orthocare.org',
      role: 'Orthodontist',
      specialization: 'BAMP Protraction & Pediatric Orthodontics',
      hospitalName: 'National Children Dental Center',
      isActive: false,
      lastLogin: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Default demo patients if Firestore list is initially empty
  const defaultPatients = [
    {
      id: 'P-1001',
      patientId: 'P-1001',
      fullName: 'Aarav Sharma',
      age: 12,
      gender: 'Male',
      diagnosis: 'Skeletal Class III malocclusion with maxillary deficiency.',
      skeletalClassification: 'Class III',
      growthPattern: 'Hypodivergent',
      treatmentPlan: 'Bone Anchored Maxillary Protraction (BAMP) with Class III elastics.',
      doctorId: 'doc-001',
      doctorName: 'Dr. Venkatapraveenamallela',
      cephalometricMeasurements: { SNA: 77.5, SNB: 81.0, ANB: -3.5, FMA: 22.0 },
      createdAt: new Date().toISOString()
    },
    {
      id: 'P-1002',
      patientId: 'P-1002',
      fullName: 'Priya Patel',
      age: 11,
      gender: 'Female',
      diagnosis: 'Skeletal Class III malocclusion with midface retrusion.',
      skeletalClassification: 'Class III',
      growthPattern: 'Normodivergent',
      treatmentPlan: 'BAMP Miniplate anchorage protocol with nocturnal traction.',
      doctorId: 'doc-002',
      doctorName: 'Dr. Sarah Connor',
      cephalometricMeasurements: { SNA: 76.0, SNB: 80.5, ANB: -4.5, FMA: 25.5 },
      createdAt: new Date().toISOString()
    }
  ];

  const [chairStatus, setChairStatus] = useState([
    { bay: 'Bay 1 (Orthodontics)', doctor: 'Dr. Venkatapraveenamallela', patient: 'Aarav Sharma', procedure: 'BAMP Elastic Engagement', status: 'In Treatment', occupancy: 'Occupied' },
    { bay: 'Bay 2 (Oral Surgery)', doctor: 'Dr. Sarah Connor', patient: 'Rohan Das', procedure: 'Miniplate Anchor Placement', status: 'Surgical Prep', occupancy: 'Occupied' },
    { bay: 'Bay 3 (Hygiene Bay)', doctor: 'Staff Nurse Ananya', patient: 'Priya Patel', procedure: 'Cephalometric Impression', status: 'In Use', occupancy: 'Occupied' },
    { bay: 'Bay 4 (X-Ray Suite)', doctor: 'Lab Tech Rajesh', patient: 'Calibration Suite', procedure: 'Cephalostat Calibration', status: 'Available', occupancy: 'Open' }
  ]);

  const [inventory] = useState([
    { item: 'BAMP Maxillary Miniplate Kits', stock: '14 Kits', status: 'Sufficient' },
    { item: 'Intermaxillary Latex Elastics (3/16")', stock: '42 Packs', status: 'Optimal' },
    { item: 'Mandibular Bone Anchor Screws (2.0mm)', stock: '8 Packs', status: 'Reorder Soon' },
    { item: 'Cephalometric Calibration Sensors', stock: '5 Units', status: 'Sufficient' }
  ]);

  // Subscribe to real-time Users & Patients from Cloud Firestore
  useEffect(() => {
    const unsubUsers = firestoreService.subscribeToUsers((uList) => {
      if (uList && uList.length > 0) {
        setDoctorsList(uList);
      } else {
        setDoctorsList(defaultDoctors);
      }
    });

    const unsubPatients = firestoreService.subscribeToPatients((pList) => {
      if (pList && pList.length > 0) {
        setPatientsList(pList);
      } else {
        setPatientsList(defaultPatients);
      }
    });

    return () => {
      unsubUsers();
      unsubPatients();
    };
  }, []);

  // Filter Doctors by search
  const filteredDoctors = doctorsList.filter(d => 
    (d.name || d.fullName || '').toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.email || '').toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(doctorSearch.toLowerCase())
  );

  // Filter Patients by search
  const filteredPatients = patientsList.filter(p =>
    (p.fullName || p.patientName || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.id || p.patientId || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.diagnosis || '').toLowerCase().includes(patientSearch.toLowerCase())
  );

  const caseLoadData = {
    labels: ['BAMP Protraction', 'Cephalometrics', 'Surgical Anchorage', 'General Consultation'],
    datasets: [
      {
        label: 'Active Cases',
        data: [patientsList.length > 0 ? patientsList.length + 12 : 18, 12, 7, 9],
        backgroundColor: ['#0ea5e9', '#6366f1', '#14b8a6', '#f59e0b'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* Operations Header Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 border border-white/10">
                Management Role Dashboard
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[9px] font-bold border border-emerald-500/30">
                Live Cloud Sync
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-sans mt-2">Clinical Management & Operations Workstation</h2>
            <p className="text-indigo-200 text-xs md:text-sm max-w-2xl font-medium mt-1">
              Central management workspace for reviewing registered doctors, logged-in orthodontists, patient master records, chair occupancy, and hospital inventory.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold transition-all flex items-center space-x-2 text-white"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Switch to Orthodontist Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/new-patient')}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/30 flex items-center space-x-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Register Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Doctors</span>
            <Stethoscope className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black mt-3 text-slate-850 dark:text-white">{doctorsList.length} Doctors</h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">Logged in & Active in system</p>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-teal-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Patient Records</span>
            <Users className="h-4 w-4 text-teal-500" />
          </div>
          <h3 className="text-2xl font-black mt-3 text-slate-850 dark:text-white">{patientsList.length} Patients</h3>
          <p className="text-[10px] text-teal-500 font-bold mt-1">Cephalometric & BAMP records</p>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-amber-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treatment Bays Occupancy</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black mt-3 text-amber-500">75% (3/4 Bays)</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Live procedure active</p>
        </GlassmorphicCard>

        <GlassmorphicCard hoverEffect={true} className="p-4 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Miniplate & Appliance Stock</span>
            <Package className="h-4 w-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-black mt-3 text-purple-500">14 Kits Ready</h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">Inventory status optimal</p>
        </GlassmorphicCard>
      </div>

      {/* SECTION 1: Registered Doctors & Logged-In Orthodontists Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-indigo-500" />
              <span>Registered Doctors & Orthodontists Management Directory</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Complete overview of all doctors logged in or registered in Orthodontics and Clinical Management.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl w-64">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors by name, role..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold bg-slate-50/50 dark:bg-slate-850/50">
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Specialization / Department</th>
                <th className="py-3 px-4">Hospital Affiliation</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No doctor profiles found matching search query.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc, idx) => (
                  <tr key={doc.uid || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-slate-100 flex items-center space-x-3">
                      <div className="h-9 w-9 bg-indigo-500 text-white font-black rounded-xl flex items-center justify-center text-xs shadow-sm">
                        {(doc.name || doc.fullName || 'Dr').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-850 dark:text-slate-100">{doc.name || doc.fullName || 'Dr. Specialist'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">UID: {(doc.uid || `DOC-${idx}`).substring(0, 8)}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {doc.email || 'doctor@hospital.org'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${doc.role === 'Clinic Manager' ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300'}`}>
                        {doc.role || 'Orthodontist'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {doc.specialization || 'Orthodontics & Dentofacial Orthopedics'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {doc.hospitalName || 'Advanced Orthodontic Care'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Logged In / Active</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedDoctorModal(doc)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold rounded-xl text-[11px] transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: All Patient Details & Master Records Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 flex items-center space-x-2">
              <Users className="h-5 w-5 text-teal-500" />
              <span>All Patients Master Records & Cephalometric Details</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Live view of all patients registered under Orthodontics and managed across the clinic.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl w-64">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, ID or diagnosis..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold bg-slate-50/50 dark:bg-slate-850/50">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Full Patient Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Skeletal Class</th>
                <th className="py-3 px-4">Growth Pattern</th>
                <th className="py-3 px-4">Diagnosis & BAMP Treatment Plan</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No patient records found matching search query.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {p.patientId || p.id || `P-${idx + 100}`}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-850 dark:text-slate-100">
                      {p.fullName || p.patientName || 'Anonymous Patient'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {p.age || 12} Yrs / {p.gender || 'Male'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                        {p.skeletalClassification || 'Class III'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.growthPattern === 'Hypodivergent' ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {p.growthPattern || 'Normodivergent'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                      {p.diagnosis || p.treatmentPlan || 'BAMP Protraction Protocol'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPatientModal(p)}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 text-teal-600 dark:text-teal-300 font-bold rounded-xl text-[11px] transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Full Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Treatment Bay & Chair Status + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Treatment Bay Occupancy Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="h-4.5 w-4.5 text-indigo-500" />
              <span>Treatment Bay & Chair Occupancy Matrix</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Live Status</span>
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

        {/* Inventory & Case Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Package className="h-4.5 w-4.5 text-teal-500" />
              <span>Appliance Inventory</span>
            </h3>

            <div className="space-y-3 text-xs font-semibold">
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
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Case Load Distribution</h4>
            <div className="h-32 mt-2 flex items-center justify-center">
              <Doughnut data={caseLoadData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: Full Patient Details View */}
      <AnimatePresence>
        {selectedPatientModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-5 text-left text-xs font-semibold relative overflow-hidden"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-300 rounded-full text-[10px] font-extrabold uppercase">
                    Patient Master File
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-850 dark:text-white mt-1">
                    {selectedPatientModal.fullName || selectedPatientModal.patientName}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedPatientModal.patientId || selectedPatientModal.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatientModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Age & Gender</p>
                  <p className="text-sm font-black mt-0.5">{selectedPatientModal.age || 12} Yrs ({selectedPatientModal.gender || 'Male'})</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Skeletal Class</p>
                  <p className="text-sm font-black text-indigo-500 mt-0.5">{selectedPatientModal.skeletalClassification || 'Class III'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Growth Pattern</p>
                  <p className="text-sm font-black text-teal-500 mt-0.5">{selectedPatientModal.growthPattern || 'Normodivergent'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Diagnosis</h4>
                  <p className="text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                    {selectedPatientModal.diagnosis || 'Skeletal Class III malocclusion due to maxillary hypoplasia and mandibular prognathism.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">BAMP Treatment Plan</h4>
                  <p className="text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                    {selectedPatientModal.treatmentPlan || 'Bone Anchored Maxillary Protraction (BAMP) with Class III intermaxillary elastics.'}
                  </p>
                </div>

                {selectedPatientModal.cephalometricMeasurements && (
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cephalometric Measurements</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-400 font-bold block">SNA</span>
                        <span className="text-sm font-black">{selectedPatientModal.cephalometricMeasurements.SNA || 77.5}°</span>
                      </div>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-400 font-bold block">SNB</span>
                        <span className="text-sm font-black">{selectedPatientModal.cephalometricMeasurements.SNB || 81.0}°</span>
                      </div>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-400 font-bold block">ANB</span>
                        <span className="text-sm font-black text-rose-500">{selectedPatientModal.cephalometricMeasurements.ANB || -3.5}°</span>
                      </div>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-400 font-bold block">FMA</span>
                        <span className="text-sm font-black">{selectedPatientModal.cephalometricMeasurements.FMA || 22.0}°</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    const pid = selectedPatientModal.patientId || selectedPatientModal.id;
                    setSelectedPatientModal(null);
                    navigate(`/clinical-insights`, { state: { patientId: pid } });
                  }}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl text-xs transition-all shadow-md"
                >
                  View AI Predictions & Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Doctor Profile View */}
      <AnimatePresence>
        {selectedDoctorModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-left text-xs font-semibold relative overflow-hidden"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-indigo-500 text-white font-black text-base rounded-2xl flex items-center justify-center shadow-md">
                    {(selectedDoctorModal.name || selectedDoctorModal.fullName || 'DR').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-850 dark:text-white">
                      {selectedDoctorModal.name || selectedDoctorModal.fullName}
                    </h3>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-0.5">
                      {selectedDoctorModal.role || 'Orthodontist'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctorModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{selectedDoctorModal.email || 'doctor@hospital.org'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Specialization:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedDoctorModal.specialization || 'Orthodontics & Dentofacial Orthopedics'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Hospital Center:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedDoctorModal.hospitalName || 'Advanced Orthodontic Care'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Active Status:</span>
                  <span className="text-emerald-500 font-bold">Logged In / Active</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedDoctorModal(null)}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ClinicManagerDashboard;
