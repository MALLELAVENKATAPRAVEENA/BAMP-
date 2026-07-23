import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { LineChart, Users, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, Filler
);

const ClinicalInsights = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(location.state?.patientId || '');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('/api/patients');
        if (res.data.success) {
          setPatients(res.data.data);
          if (!selectedPatientId && res.data.data.length > 0) {
            setSelectedPatientId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load patient catalog:", err.message);
        setPatients([
          { id: "P-1001", fullName: "Aarav Sharma" },
          { id: "P-1002", fullName: "Priya Patel" }
        ]);
        setSelectedPatientId("P-1001");
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchPrediction = async () => {
      try {
        const res = await axios.get('/api/predictions');
        if (res.data.success) {
          const match = res.data.data.find(p => p.patientId === selectedPatientId);
          setPrediction(match || null);
        }
      } catch (err) {
        console.error("Failed to fetch predictions, using mock fallback:", err.message);
        // Fallback prediction
        setPrediction({
          patientId: "P-1001",
          patientName: "Aarav Sharma",
          successProbability: 88.5,
          confidenceScore: 92.0,
          riskLevel: "Low",
          growthResponse: "High Response Potential",
          expectedMaxillaryAdvancement: "3.8 mm",
          expectedSkeletalImprovement: "ANB angle improvement by +3.2°",
          measurements: { SNA: "77.5°", SNB: "80.5°", ANB: "-3.0°", FMA: "22.5°" }
        });
      }
    };
    fetchPrediction();
  }, [selectedPatientId]);

  // Chart 1: Cephalometrics comparison (Patient vs Clinical Norms)
  const patientMeasurements = prediction?.measurements || { SNA: '77.5°', SNB: '80.5°', ANB: '-3.0°', FMA: '22.5°' };
  
  const parseVal = (str) => parseFloat(str?.replace(/[^0-9.-]/g, '')) || 0;

  const compareData = {
    labels: ['SNA (Maxilla Placement)', 'SNB (Mandible Placement)', 'ANB (Jaw Gap Rel)', 'FMA (Vertical Divergence)'],
    datasets: [
      {
        label: 'Patient Angle (Degrees)',
        data: [
          parseVal(patientMeasurements.SNA),
          parseVal(patientMeasurements.SNB),
          parseVal(patientMeasurements.ANB),
          parseVal(patientMeasurements.FMA)
        ],
        backgroundColor: '#0ea5e9',
        borderRadius: 8,
      },
      {
        label: 'Clinical Norm (Mean)',
        data: [82.0, 80.0, 2.0, 25.0],
        backgroundColor: 'rgba(148, 163, 184, 0.4)',
        borderRadius: 8,
      }
    ]
  };

  // Chart 2: Success response probability vs Skeletal Age peak puberty curve
  const growthCurveData = {
    labels: ['Age 8', 'Age 10', 'Age 12', 'Age 14', 'Age 16'],
    datasets: [
      {
        label: 'BAMP Orthopedic Skeletal Responsiveness (%)',
        data: [70, 92, 88, 55, 30],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1'
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title with Patient Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Clinical Insights Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">Cross-referencing patient parameters with skeletal growth benchmarks.</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric cards column */}
        <div className="space-y-6">
          
          <GlassmorphicCard hoverEffect={false} className="bg-white/80 dark:bg-slate-900/80">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-4">Treatment Probability Outcomes</h3>
            <div className="text-center py-4">
              <span className="text-4xl font-extrabold text-medical-500">{prediction ? prediction.successProbability : 85.0}%</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Success Likelihood</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Confidence Score:</span>
                <span>{prediction ? prediction.confidenceScore : 90.0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Clinical Risk Tier:</span>
                <span className={prediction?.riskLevel === 'Low' ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                  {prediction ? prediction.riskLevel : 'Low'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Growth Response:</span>
                <span>{prediction ? prediction.growthResponse : 'High Response'}</span>
              </div>
            </div>
          </GlassmorphicCard>

          <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 p-5 rounded-3xl flex items-start space-x-3 text-xs">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-800 dark:text-amber-400">Orthodontic Pre-requisite Alerts</h4>
              <p className="text-amber-700 dark:text-amber-450 leading-relaxed mt-1 font-semibold">
                This candidate shows mixed dentition stage anchors points. Monitor primary molar roots margins closely during initial 150g loading sequence.
              </p>
            </div>
          </div>

        </div>

        {/* Charts graphs columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart 1: Cephalometrics compared */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center space-x-2">
              <LineChart className="h-4.5 w-4.5 text-medical-500" />
              <span>Skeletal Metric vs Clinical Averages</span>
            </h3>
            <div className="h-60">
              <Bar 
                data={compareData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { grid: { color: 'rgba(148, 163, 184, 0.05)' } } }
                }} 
              />
            </div>
          </div>

          {/* Chart 2: Age response curve */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center space-x-2">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
              <span>Age Responsiveness Curve</span>
            </h3>
            <div className="h-56">
              <Line 
                data={growthCurveData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { max: 100, grid: { color: 'rgba(148, 163, 184, 0.05)' } } }
                }} 
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ClinicalInsights;
