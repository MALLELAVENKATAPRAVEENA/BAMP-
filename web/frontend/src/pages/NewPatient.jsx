import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, ClipboardList, Stethoscope, Save, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const NewPatient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Auto-generate a unique Patient ID
  const defaultPatientId = `P-${Math.floor(1000 + Math.random() * 9000)}`;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      patientId: defaultPatientId,
      id: defaultPatientId,
      fullName: '',
      age: '',
      gender: 'Male',
      dob: '',
      contactNumber: '',
      emailAddress: '',
      address: '',
      medicalHistory: 'No systemic illness. General health satisfactory.',
      familyHistory: 'Father has Class III malocclusion history.',
      chiefComplaint: 'Underbite and aesthetic concerns.',
      diagnosis: 'Skeletal Class III malocclusion with maxillary hypoplasia.',
      skeletalClassification: 'Class III',
      growthPattern: 'Normodivergent',
      treatmentPlan: 'Bone Anchored Maxillary Protraction (BAMP) with surgical miniplates.',
      orthodontistNotes: 'Late mixed dentition stage. Optimal growth potential. Patient cooperative.'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Write to Cloud Firestore patients collection
      const created = await firestoreService.createPatient(data, user?.uid || 'doctor_1');
      
      // 2. Write to audit logs collection
      await firestoreService.logAuditEvent(user?.uid, 'CREATE_PATIENT', 'patients', created.patientId || created.id, { patientName: data.fullName });
      
      // 3. Optional backend call
      await axios.post('/api/patients', data).catch(() => {});

      toast.success(`Patient ${data.fullName} registered in Cloud Firestore!`);
      setTimeout(() => {
        navigate('/patient-records');
      }, 1200);
    } catch (err) {
      toast.error(err.message || 'Failed to register patient.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Patient Registration Station</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* SECTION 1: Personal Demographics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="h-5 w-5 text-medical-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Personal & Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID (Auto)</label>
              <input
                type="text"
                readOnly
                {...register('id')}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="Aarav Sharma"
                {...register('fullName', { required: 'Patient Name is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
              <input
                type="date"
                {...register('dob', { required: 'Date of birth is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.dob && <p className="text-xs text-rose-500">{errors.dob.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age (Years)</label>
              <input
                type="number"
                placeholder="12"
                {...register('age', { required: 'Age is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                {...register('contactNumber', { required: 'Contact phone is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.contactNumber && <p className="text-xs text-rose-500">{errors.contactNumber.message}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="aarav.sharma@example.com"
                {...register('emailAddress', { required: 'Email address is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.emailAddress && <p className="text-xs text-rose-500">{errors.emailAddress.message}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residential Address</label>
              <input
                type="text"
                placeholder="124 Medical Enclave, New Delhi, India"
                {...register('address')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: Medical & Diagnostic History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ClipboardList className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">2. Medical & Family History</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Systemic Medical History</label>
              <textarea
                rows="3"
                {...register('medicalHistory')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skeletal/Dental Family History</label>
              <textarea
                rows="3"
                {...register('familyHistory')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium text-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Clinical Diagnosis & Skeletal Pattern */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Stethoscope className="h-5 w-5 text-teal-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">3. Orthodontic Diagnosis & Skeletal Plan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chief Complaint</label>
              <input
                type="text"
                placeholder="Upper jaw looks set back, underbite"
                {...register('chiefComplaint', { required: 'Chief Complaint is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.chiefComplaint && <p className="text-xs text-rose-500">{errors.chiefComplaint.message}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Diagnosis</label>
              <textarea
                rows="2"
                {...register('diagnosis')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skeletal Classification</label>
              <select
                {...register('skeletalClassification')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              >
                <option value="Class III">Skeletal Class III</option>
                <option value="Class I">Skeletal Class I</option>
                <option value="Class II">Skeletal Class II</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">Growth Divergence Pattern</label>
              <select
                {...register('growthPattern')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              >
                <option value="Normodivergent">Normodivergent</option>
                <option value="Hypodivergent">Hypodivergent (Horizontal)</option>
                <option value="Hyperdivergent">Hyperdivergent (Vertical)</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proposed Treatment Plan</label>
              <textarea
                rows="3"
                {...register('treatmentPlan')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium text-sm"
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orthodontist Notes & Observations</label>
              <textarea
                rows="3"
                {...register('orthodontistNotes')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium text-sm"
              />
            </div>

          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 font-semibold rounded-2xl transition-colors"
          >
            Reset Form
          </button>
          
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
                <span>Save Patient Profile</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default NewPatient;
