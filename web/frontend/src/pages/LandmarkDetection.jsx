import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, RefreshCw, ZoomIn, ZoomOut, Maximize2, 
  MapPin, Eye, FileText, BarChart3, HelpCircle 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Default mock cephalogram image (using inline medical grid illustration)
const defaultScanUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Cpath d='M 100 0 L 100 600 M 200 0 L 200 600 M 300 0 L 300 600 M 400 0 L 400 600 M 500 0 L 500 600 M 600 0 L 600 600 M 700 0 L 700 600' stroke='%23334155' stroke-width='0.5'/%3E%3Cpath d='M 0 100 L 800 100 M 0 200 L 800 200 M 0 300 L 800 300 M 0 400 L 800 400 M 0 500 L 800 500' stroke='%23334155' stroke-width='0.5'/%3E%3Cpath d='M 120 180 C 180 180, 240 120, 310 120 C 370 120, 420 160, 480 180 C 530 200, 560 170, 590 200 C 620 230, 600 300, 580 320 C 560 340, 530 310, 500 350 C 470 390, 450 440, 480 470 C 510 500, 530 520, 500 540 C 470 560, 400 500, 350 480 C 300 460, 270 410, 280 380 C 290 350, 240 280, 200 270 C 160 260, 120 220, 120 180 Z' fill='none' stroke='%2364748b' stroke-width='2' stroke-dasharray='5,5'/%3E%3Ctext x='40' y='50' fill='%2364748b' font-family='sans-serif' font-size='12'%3ELateral Cephalogram Calibration Grid%3C/text%3E%3C/svg%3E";

const LandmarkDetection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Retrieve pipeline prediction state if available, or generate standard demo values
  const [prediction, setPrediction] = useState(location.state?.prediction || null);
  const [landmarks, setLandmarks] = useState({});
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [draggedLandmark, setDraggedLandmark] = useState(null);
  const [showAngles, setShowAngles] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations state
  const [angles, setAngles] = useState({ SNA: 77.5, SNB: 80.5, ANB: -3.0, FMA: 22.5 });

  useEffect(() => {
    if (prediction && prediction.landmarks) {
      setLandmarks(prediction.landmarks);
    } else {
      // Prepopulated defaults
      const defaultPoints = {
        Nasion: { x: 530, y: 160, description: "Deepest point of the nasofrontal suture" },
        Sella: { x: 310, y: 190, description: "Center of the sella turcica" },
        PointA: { x: 510, y: 290, description: "Deepest midline point on the maxilla" },
        PointB: { x: 490, y: 390, description: "Deepest midline point on the mandible" },
        ANS: { x: 540, y: 270, description: "Anterior nasal spine" },
        PNS: { x: 360, y: 275, description: "Posterior nasal spine" },
        Menton: { x: 480, y: 470, description: "Lowest point of the mandibular symphysis" },
        Pogonion: { x: 505, y: 440, description: "Most anterior point of the chin" },
        Gonion: { x: 300, y: 390, description: "Most posterior inferior point of the mandibular angle" },
        Orbitale: { x: 450, y: 200, description: "Lowest point on the margin of the orbit" },
        Porion: { x: 260, y: 220, description: "Highest point of the external auditory meatus" },
        Gnathion: { x: 500, y: 460, description: "Most anterior inferior point of the bony chin" },
        Basion: { x: 240, y: 280, description: "Lowest point on the anterior margin of the foramen magnum" },
        Articulare: { x: 280, y: 270, description: "Intersection of mandibular condyle and occipital bone" }
      };
      setLandmarks(defaultPoints);
    }
  }, [prediction]);

  // Recalculate cephalometric angles dynamically
  useEffect(() => {
    if (Object.keys(landmarks).length === 0) return;

    const getVector = (pStart, pEnd) => ({ x: pEnd.x - pStart.x, y: pEnd.y - pStart.y });
    const getAngleBetween = (v1, v2) => {
      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      if (mag1 === 0 || mag2 === 0) return 0;
      return (Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180) / Math.PI;
    };

    const s = landmarks.Sella;
    const n = landmarks.Nasion;
    const a = landmarks.PointA;
    const b = landmarks.PointB;
    const po = landmarks.Porion;
    const or = landmarks.Orbitale;
    const go = landmarks.Gonion;
    const me = landmarks.Menton;

    if (s && n && a && b && po && or && go && me) {
      const vSA = getVector(n, s);
      const vNA = getVector(n, a);
      const vNB = getVector(n, b);

      const snaAngle = parseFloat(getAngleBetween(vSA, vNA).toFixed(1));
      const snbAngle = parseFloat(getAngleBetween(vSA, vNB).toFixed(1));
      const anbAngle = parseFloat((snaAngle - snbAngle).toFixed(1));

      const vFH = getVector(po, or);
      const vMP = getVector(go, me);
      const fmaAngle = parseFloat(getAngleBetween(vFH, vMP).toFixed(1));

      setAngles({
        SNA: snaAngle,
        SNB: snbAngle,
        ANB: anbAngle,
        FMA: fmaAngle
      });
    }
  }, [landmarks]);

  // Draw overlay canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = prediction?.scanUrl || defaultScanUrl;
    img.onload = () => {
      // Draw background scan
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw measurement lines overlay
      if (showAngles && Object.keys(landmarks).length > 0) {
        ctx.strokeStyle = 'rgba(14, 144, 233, 0.4)';
        ctx.lineWidth = 1.5;

        const s = landmarks.Sella;
        const n = landmarks.Nasion;
        const a = landmarks.PointA;
        const b = landmarks.PointB;
        const po = landmarks.Porion;
        const or = landmarks.Orbitale;
        const go = landmarks.Gonion;
        const me = landmarks.Menton;

        // Draw S-N-A lines
        if (s && n && a) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(n.x, n.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }

        // Draw S-N-B lines
        if (n && b) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(n.x, n.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
          ctx.stroke();
        }

        // Draw Frankfort Horizontal (Porion - Orbitale)
        if (po && or) {
          ctx.beginPath();
          ctx.moveTo(po.x, po.y);
          ctx.lineTo(or.x, or.y);
          ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
          ctx.stroke();
        }

        // Draw Mandibular Plane (Gonion - Menton)
        if (go && me) {
          ctx.beginPath();
          ctx.moveTo(go.x, go.y);
          ctx.lineTo(me.x, me.y);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.stroke();
        }
      }

      // Draw Landmark Points
      Object.keys(landmarks).forEach((key) => {
        const pt = landmarks[key];
        const isSelected = selectedLandmark === key;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isSelected ? 7 : 4.5, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#38abf9' : '#0272c6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Print landmark label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Inter';
        ctx.fillText(key, pt.x + 8, pt.y + 3);
      });
    };
  }, [landmarks, selectedLandmark, showAngles, prediction]);

  // Mouse drag events handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if clicked near any landmark (radius threshold 10px)
    let foundKey = null;
    Object.keys(landmarks).forEach((key) => {
      const pt = landmarks[key];
      const dist = Math.sqrt(Math.pow(clickX - pt.x, 2) + Math.pow(clickY - pt.y, 2));
      if (dist < 10) {
        foundKey = key;
      }
    });

    if (foundKey) {
      setSelectedLandmark(foundKey);
      setDraggedLandmark(foundKey);
    } else {
      setSelectedLandmark(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggedLandmark) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Keep inside boundary bounds
    const boundedX = Math.max(0, Math.min(canvas.width, x));
    const boundedY = Math.max(0, Math.min(canvas.height, y));

    setLandmarks(prev => ({
      ...prev,
      [draggedLandmark]: {
        ...prev[draggedLandmark],
        x: Math.round(boundedX),
        y: Math.round(boundedY)
      }
    }));
  };

  const handleMouseUp = () => {
    setDraggedLandmark(null);
  };

  const handleTriggerPrediction = async () => {
    setIsProcessing(true);
    try {
      // Send manual parameters or updated angles to evaluate
      const res = await axios.post('/api/predictions/predict', {
        patientId: prediction?.patientId || 'P-1001',
        SNA: angles.SNA,
        SNB: angles.SNB,
        FMA: angles.FMA
      });

      if (res.data.success) {
        toast.success('Predictive outcome generated from coordinates!');
        setTimeout(() => {
          navigate('/ai-outcomes', { state: { prediction: res.data.data } });
        }, 1200);
      }
    } catch (err) {
      toast.error('AI outcome generation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Landmark Calibration Station</h2>
          <p className="text-xs text-slate-500 mt-1">
            Drag landmark coordinates directly on the X-Ray to adjust cephalometric calculations.
          </p>
        </div>
        
        <button
          onClick={handleTriggerPrediction}
          disabled={isProcessing}
          className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-medical-500 to-indigo-600 hover:from-medical-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs transition-colors"
        >
          <Play className="h-4.5 w-4.5" />
          <span>Generate AI Prediction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Angles Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Live angles readout */}
          <div>
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-3">Live Cephalometrics</h3>
            <div className="space-y-3.5">
              
              <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold">SNA Angle</span>
                <span className="font-mono text-sm text-medical-600 dark:text-medical-400 font-bold">{angles.SNA}°</span>
              </div>
              
              <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold">SNB Angle</span>
                <span className="font-mono text-sm text-indigo-500 font-bold">{angles.SNB}°</span>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold">ANB Angle</span>
                <span className={`font-mono text-sm font-bold ${angles.ANB < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  {angles.ANB}°
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2">
                <span className="font-bold">FMA Angle</span>
                <span className="font-mono text-sm text-teal-500 font-bold">{angles.FMA}°</span>
              </div>

            </div>
          </div>

          {/* Diagnosis classification summary based on live angles */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4.5 rounded-2xl border border-slate-150/40 dark:border-slate-800 space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skeletal Class</h4>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-250">
              {angles.ANB < 0 ? 'Skeletal Class III Profile (Underbite)' : 'Skeletal Class I/II Profile'}
            </p>
            <p className="text-[10px] text-slate-500 leading-normal">
              ANB Angle negative indicates a mandibular placement ahead of maxillary parameters. Ideal for BAMP skeletal anchors correction.
            </p>
          </div>

          {/* Selected Landmark Detail Card */}
          <div className="border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Landmark</h4>
            {selectedLandmark ? (
              <div>
                <p className="text-xs font-bold text-medical-600 dark:text-medical-400 flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{selectedLandmark}</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1 leading-normal">
                  {landmarks[selectedLandmark]?.description || 'Cephalometric anchor calibration mark.'}
                </p>
                <p className="text-[9px] font-mono text-slate-400 mt-2">
                  X: {landmarks[selectedLandmark]?.x}px | Y: {landmarks[selectedLandmark]?.y}px
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">Click any landmark dot on the canvas overlay to display anatomical description.</p>
            )}
          </div>

        </div>

        {/* Workstation Canvas View */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          
          {/* Workstation Controls */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-805/85 pb-4 mb-4">
            <div className="flex items-center space-x-3 text-xs font-bold">
              <span className="flex items-center space-x-1 text-slate-500">
                <Eye className="h-4 w-4" />
                <span>Cephalometric Viewport</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowAngles(!showAngles)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${showAngles ? 'bg-medical-50 border-medical-200 text-medical-600 dark:bg-medical-950/20 dark:border-medical-900 dark:text-medical-400' : 'border-slate-200 text-slate-500'}`}
              >
                Toggle Guide Lines
              </button>
              <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><ZoomOut className="h-4.5 w-4.5" /></button>
              <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><ZoomIn className="h-4.5 w-4.5" /></button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-950/90 aspect-[4/3] flex items-center justify-center cursor-crosshair">
            <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s ease' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="max-w-full max-h-full block"
              />
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span>Scan Source: {prediction?.scanType || 'Demo Calibration Cephalogram'}</span>
            <span>Target Resolution: 800 x 600 px</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LandmarkDetection;
