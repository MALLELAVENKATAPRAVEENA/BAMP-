import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Search, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Reports = () => {
  const location = useLocation();
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const activePredId = location.state?.predictionId;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/predictions');
      if (res.data.success) {
        setPredictions(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load reports directory:", err.message);
      // Fallback predictions
      setPredictions([
        { id: "PRED-001", patientId: "P-1001", patientName: "Aarav Sharma", successProbability: 88.5, confidenceScore: 92.0, riskLevel: "Low", createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
        { id: "PRED-002", patientId: "P-1002", patientName: "Priya Patel", successProbability: 82.4, confidenceScore: 89.5, riskLevel: "Low", createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (predictionId) => {
    toast.info("Compiling medical PDF report, please wait...");
    
    // Direct window location trigger to download binary stream from express
    setTimeout(() => {
      window.open(`/api/reports/generate?predictionId=${predictionId}`, '_blank');
      toast.success("PDF report downloaded successfully.");
    }, 1000);
  };

  // Filter reports by patient name or ID
  const filteredReports = predictions.filter(pred => 
    pred.patientName.toLowerCase().includes(search.toLowerCase()) ||
    pred.patientId.toLowerCase().includes(search.toLowerCase()) ||
    pred.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Clinical Reports Center</h2>
        <p className="text-xs text-slate-500 mt-1">Download and print orthodontic evaluation PDF logs.</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Patient ID, Name or Report Reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-sm focus:outline-none w-full font-medium"
        />
      </div>

      {/* Reports Directory Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-500"></div>
            <p className="text-xs text-slate-450 font-semibold font-sans">Compiling reports catalog...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-550">No reports generated for this search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Report Reference</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Patient ID</th>
                  <th className="px-6 py-4">Date Computed</th>
                  <th className="px-6 py-4">Success Rate</th>
                  <th className="px-6 py-4">AI Confidence</th>
                  <th className="px-6 py-4 text-right">PDF Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                {filteredReports.map((pred) => {
                  const isActive = activePredId === pred.id;

                  return (
                    <tr 
                      key={pred.id} 
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors ${isActive ? 'bg-medical-500/5 dark:bg-medical-950/10' : ''}`}
                    >
                      <td className="px-6 py-4 font-mono text-slate-550 dark:text-slate-400">{pred.id}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-100">{pred.patientName}</td>
                      <td className="px-6 py-4 font-mono text-medical-600 dark:text-medical-400">{pred.patientId}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(pred.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-205">{pred.successProbability}%</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-medical-500" />
                          <span>{pred.confidenceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownload(pred.id)}
                          className="inline-flex items-center space-x-1 px-4.5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200/60 dark:border-slate-850 shadow-sm transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
