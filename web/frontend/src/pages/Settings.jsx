import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, ShieldAlert, Cpu, User, Landmark, Database } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: 'Dr. Venkatapraveenamallela',
    email: 'dr.venkat@hospital.org',
    specialization: 'Orthodontist & Dentofacial Orthopedics',
    hospitalName: 'Advanced Orthodontic Care & AI Research Center',
    firebaseProjectId: 'bamp-ai-predictor',
    theme: 'dark',
    notificationPrefs: {
      email: true,
      push: true,
      reports: true
    },
    aiModelVersion: 'BAMP-Net v2.4 (Active)'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load doctor settings details, using mock defaults:", err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleNestedChange = (parent, field, val) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: val
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.put('/api/settings', formData);
      if (res.data.success) {
        toast.success("Clinical settings updated successfully.");
      }
    } catch (err) {
      toast.error("Failed to update clinical settings details.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Specialist Profile', icon: User },
    { id: 'hospital', name: 'Hospital Details', icon: Landmark },
    { id: 'firebase', name: 'Firebase Credentials', icon: Database },
    { id: 'ai', name: 'AI Prediction Net', icon: Cpu }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Workstation Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">Manage clinical credentials, database access, and AI parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeTab === tab.id ? 'bg-medical-500/10 border-medical-500 text-medical-600 dark:text-medical-400' : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <tab.icon className="h-4.5 w-4.5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Configuration Forms */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm text-left">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Specialist Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orthodontist Name</label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => handleInputChange('doctorName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medical Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hospital' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Hospital Details</h3>
                
                <div className="space-y-1.5 text-xs font-semibold">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital / Research Clinic Header</label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'firebase' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Firebase Credentials</h3>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project ID</label>
                    <input
                      type="text"
                      value={formData.firebaseProjectId}
                      onChange={(e) => handleInputChange('firebaseProjectId', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850 p-4.5 border border-slate-150/40 dark:border-slate-800 rounded-2xl flex items-start space-x-3">
                    <ShieldAlert className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-normal">
                      Vite dynamically reads client-side configurations. Restart dev server after updating backend variables to bind collections updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">AI Prediction Net</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation model Version</label>
                    <select
                      value={formData.aiModelVersion}
                      onChange={(e) => handleInputChange('aiModelVersion', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                    >
                      <option value="BAMP-Net v2.4 (Active)">BAMP-Net v2.4 (Active)</option>
                      <option value="BAMP-Net v2.3">BAMP-Net v2.3</option>
                      <option value="Skeletal Classifier ResNet-50">Skeletal Classifier ResNet-50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-4.5 w-4.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
