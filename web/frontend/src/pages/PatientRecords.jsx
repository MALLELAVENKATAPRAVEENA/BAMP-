import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, UserCog, Trash2, Eye, MapPin, Plus, ArrowUpDown } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Real-time Firestore subscription
    const unsub = firestoreService.subscribeToPatients((list) => {
      if (list && list.length > 0) {
        setPatients(list);
        setIsLoading(false);
      } else {
        // Fallback fetch
        fetchPatients();
      }
    });

    return () => unsub();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const list = await firestoreService.getPatients();
      if (list && list.length > 0) {
        setPatients(list);
      } else {
        const res = await axios.get('/api/patients');
        if (res.data.success) setPatients(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load patients list:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete patient ${name} (${id})?`)) {
      try {
        await firestoreService.deletePatient(id);
        await firestoreService.logAuditEvent(user?.uid, 'DELETE_PATIENT', 'patients', id);
        toast.success(`Patient record deleted from Cloud Firestore.`);
      } catch (err) {
        toast.error('Failed to delete patient record.');
      }
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Filter patients by name or ID
  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'age') {
      aVal = parseInt(aVal);
      bVal = parseInt(bVal);
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Patients Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Manage profiles and trigger craniofacial AI analysis pipelines.</p>
        </div>
        <button
          onClick={() => navigate('/new-patient')}
          className="inline-flex items-center space-x-2 px-5 py-3 bg-medical-500 hover:bg-medical-400 text-white font-bold rounded-2xl shadow-sm text-xs transition-colors"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by Patient Name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-sm focus:outline-none w-full font-medium"
        />
      </div>

      {/* Records Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-500"></div>
            <p className="text-xs text-slate-400 font-semibold">Retrieving patient directories...</p>
          </div>
        ) : sortedPatients.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-500">No patient records found matching the query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center space-x-1.5">
                      <span>Patient ID</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('fullName')}>
                    <div className="flex items-center space-x-1.5">
                      <span>Full Name</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('age')}>
                    <div className="flex items-center space-x-1.5">
                      <span>Age</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Skeletal Class</th>
                  <th className="px-6 py-4">Growth Pattern</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                {sortedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-medical-600 dark:text-medical-400">{patient.id}</td>
                    <td className="px-6 py-4 text-slate-750 dark:text-slate-200">{patient.fullName}</td>
                    <td className="px-6 py-4">{patient.age} Yrs</td>
                    <td className="px-6 py-4 text-slate-500">{patient.gender}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {patient.skeletalClassification || 'Class III'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${patient.growthPattern === 'Hypodivergent' ? 'bg-teal-50 text-teal-650 dark:bg-teal-950/40 dark:text-teal-400' : (patient.growthPattern === 'Hyperdivergent' ? 'bg-amber-50 text-amber-650 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400')}`}>
                        {patient.growthPattern || 'Normodivergent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2.5">
                        
                        {/* Process AI Analysis */}
                        <button
                          onClick={() => navigate('/upload-scan', { state: { patientId: patient.id } })}
                          className="p-2 text-medical-500 hover:bg-medical-50 dark:hover:bg-medical-950/20 rounded-xl transition-all"
                          title="Evaluate Scan via AI Engine"
                        >
                          <MapPin className="h-4.5 w-4.5" />
                        </button>
                        
                        {/* View Report */}
                        <button
                          onClick={() => navigate('/clinical-insights', { state: { patientId: patient.id } })}
                          className="p-2 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/20 rounded-xl transition-all"
                          title="View Insights & Predictions"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete Patient */}
                        <button
                          onClick={() => handleDelete(patient.id, patient.fullName)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
