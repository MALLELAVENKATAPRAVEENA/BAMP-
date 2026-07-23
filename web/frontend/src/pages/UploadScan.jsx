import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, ShieldAlert, CheckCircle2, Play, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UploadScan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(location.state?.patientId || '');
  const [scanType, setScanType] = useState('Lateral Cephalogram');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
        console.error("Failed to load patients catalog:", err.message);
        setPatients([
          { id: "P-1001", fullName: "Aarav Sharma" },
          { id: "P-1002", fullName: "Priya Patel" }
        ]);
        setSelectedPatientId("P-1001");
      }
    };
    fetchPatients();
  }, [selectedPatientId]);

  const onDrop = useCallback((acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    if (!droppedFile) return;

    // Local file validation
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (droppedFile.size > maxBytes) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    setFile(Object.assign(droppedFile, {
      preview: URL.createObjectURL(droppedFile)
    }));

    // Trigger mock progress animation
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success('Scan file uploaded successfully to cache.');
          return 100;
        }
        return old + 20;
      });
    }, 150);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false
  });

  const handleRemoveFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    setUploadProgress(0);
  };

  const handleProcessScan = async () => {
    if (!selectedPatientId) {
      toast.error('Please select a target patient first.');
      return;
    }
    if (!file) {
      toast.error('Please upload an orthodontic scan file.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('patientId', selectedPatientId);
      formData.append('scanType', scanType);
      formData.append('scanFile', file);

      const res = await axios.post('/api/predictions/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('AI Craniofacial Evaluation Complete!');
        setTimeout(() => {
          // Route immediately to landmark detection, passing the evaluation outcome
          navigate('/landmark-detection', { state: { prediction: res.data.data } });
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI engine failed to process scan.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Scan Upload Center</h2>
        <p className="text-xs text-slate-500 mt-1">Upload orthognathic diagnostic images for landmark detection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Bind Patient */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="h-4 w-4" />
                <span>Target Patient</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>
                ))}
              </select>
            </div>

            {/* Scan Modality selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Imaging Modality</label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              >
                <option value="Lateral Cephalogram">Lateral Cephalogram</option>
                <option value="CBCT Scan Slice">CBCT Orthognathic Slice</option>
                <option value="Panoramic X-Ray">Panoramic X-Ray</option>
                <option value="Facial Profile Photograph">Facial Profile Photo</option>
                <option value="Intraoral Dental Image">Intraoral Dental Image</option>
              </select>
            </div>

            {/* Specifications Box */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Standards</h4>
              <ul className="text-[10px] space-y-1.5 text-slate-450 dark:text-slate-400 font-semibold list-disc list-inside">
                <li>Format: JPG, PNG, WEBP</li>
                <li>Aspect Ratio: Standard lateral cephalogram layout</li>
                <li>Resolution: Minimum 1024x768 pixels</li>
                <li>Maximum File Size: 10MB</li>
              </ul>
            </div>

          </div>

          {/* Trigger Process Button */}
          <button
            onClick={handleProcessScan}
            disabled={isProcessing || isUploading || !file}
            className="w-full py-4 bg-gradient-to-r from-medical-500 to-indigo-600 hover:from-medical-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Play className="h-4.5 w-4.5" />
                <span>Process AI Diagnosis</span>
              </>
            )}
          </button>
        </div>

        {/* File Dropzone Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
          
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...getRootProps()}
                className={`w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-200 ${isDragActive ? 'border-medical-500 bg-medical-50/20 dark:bg-medical-950/10' : 'border-slate-200 hover:border-slate-350 dark:border-slate-800'}`}
              >
                <input {...getInputProps()} />
                <div className="p-4 bg-medical-500/5 dark:bg-medical-500/10 rounded-2xl text-medical-500 mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold">Drag and drop file here, or click to browse</h4>
                <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 font-medium">Supports cephalometric X-Rays, CBCT slices and photos</p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full space-y-4"
              >
                {/* Image Preview Container */}
                <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-slate-50 dark:bg-slate-950 max-h-[300px]">
                  <img
                    src={file.preview}
                    alt="Orthodontic Scan preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-4.5 right-4.5 p-2 bg-rose-500 hover:bg-rose-450 text-white rounded-xl shadow-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload Status Card */}
                <div className="border border-slate-100 dark:border-slate-850 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs">
                    <FileImage className="h-5 w-5 text-medical-500" />
                    <div>
                      <p className="font-semibold truncate max-w-xs">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    {isUploading ? (
                      <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                        <span>Uploading ({uploadProgress}%)</span>
                        <div className="w-16 bg-slate-150 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-medical-500 h-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-500 font-bold">
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        <span>Ready</span>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

export default UploadScan;
