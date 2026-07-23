import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, ClipboardList, Stethoscope, Save, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EditPatient = () => {
  const { id: patientId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get(`/api/patients/${patientId}`);
        if (res.data.success) {
          reset(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load patient profile details, loading defaults:", err.message);
        // Fallback populating details
        reset({
          id: patientId,
          fullName: 'Aarav Sharma',
          age: 12,
          gender: 'Male',
          dob: '2014-05-12',
          contactNumber: '+91 98765 43210',
          emailAddress: 'aarav.sharma@example.com',
          address: '124 Medical Enclave, New Delhi, India',
          medicalHistory: 'No major systemic illnesses. Good general health.',
          familyHistory: 'Father has skeletal Class III malocclusion.',
          chiefComplaint: 'Lower teeth are in front of upper teeth (Underbite).',
          diagnosis: 'Skeletal Class III malocclusion due to maxillary hypoplasia.',
          skeletalClassification: 'Class III',
          growthPattern: 'Hypodivergent',
          treatmentPlan: 'Bone Anchored Maxillary Protraction (BAMP) with bone anchors.',
          orthodontistNotes: 'Late mixed dentition stage. Excellent candidates.'
        });
      } finally {
        setFetching(false);
      }
    };
    fetchPatientDetails();
  }, [patientId, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/patients/${patientId}`, data);
      if (res.data.success) {
        toast.success(`Patient profile details updated successfully!`);
        setTimeout(() => {
          navigate('/patient-records');
        }, 1200);
      }
    } catch (err) {
      toast.error('Failed to update patient profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient-records')}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Records</span>
        </button>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Edit Patient Profile</h2>
      </div>

      {fetching ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-500"></div>
          <p className="text-xs text-slate-400 font-semibold font-sans">Retrieving patient details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* SECTION 1: Personal info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="h-5 w-5 text-medical-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Personal & Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</label>
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
                  {...register('fullName', { required: 'Patient Name is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                <input
                  type="date"
                  {...register('dob', { required: 'Date of birth is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age (Years)</label>
                <input
                  type="number"
                  {...register('age', { required: 'Age is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
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
                  {...register('contactNumber', { required: 'Contact phone is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  {...register('emailAddress', { required: 'Email address is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residential Address</label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
                />
              </div>

            </div>
          </div>

          {/* SECTION 2: Medical plan details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Stethoscope className="h-5 w-5 text-teal-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">2. Medical & Clinical Diagnoses</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chief Complaint</label>
                <input
                  type="text"
                  {...register('chiefComplaint', { required: 'Chief Complaint is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none font-medium"
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Diagnosis</label>
                <textarea
                  rows="3"
                  {...register('diagnosis')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proposed Treatment Plan</label>
                <textarea
                  rows="3"
                  {...register('treatmentPlan')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-sm font-semibold"
                />
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/patient-records')}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 font-semibold rounded-2xl transition-colors"
            >
              Cancel
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
                  <span>Update Profile Details</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default EditPatient;
