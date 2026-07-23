import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User, Mail, Award, Landmark, Save, ArrowLeft, 
  Phone, ShieldCheck, CheckCircle2, UserCheck, Stethoscope, Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: user?.name || 'Dr. Venkatapraveenamallela',
      email: user?.email || 'dr.venkat@hospital.org',
      role: user?.role || 'Orthodontist',
      specialization: user?.specialization || 'Orthodontics & Dentofacial Orthopedics',
      hospitalName: user?.hospitalName || 'Advanced Orthodontic Care & AI Research Center',
      phone: user?.phone || '+91 98765 43210',
      bio: user?.bio || 'Specializing in Class III malocclusion treatment, Bone-Anchored Maxillary Protraction (BAMP), and cephalometric AI diagnostics.'
    }
  });

  // Watch fields for live card preview
  const watchedName = watch('name');
  const watchedRole = watch('role');
  const watchedSpecialization = watch('specialization');
  const watchedHospital = watch('hospitalName');
  const watchedEmail = watch('email');

  useEffect(() => {
    if (user) {
      setValue('name', user.name || 'Dr. Venkatapraveenamallela');
      setValue('email', user.email || 'dr.venkat@hospital.org');
      setValue('role', user.role || 'Orthodontist');
      setValue('specialization', user.specialization || 'Orthodontics & Dentofacial Orthopedics');
      setValue('hospitalName', user.hospitalName || 'Advanced Orthodontic Care & AI Research Center');
      setValue('phone', user.phone || '+91 98765 43210');
      setValue('bio', user.bio || 'Specializing in Class III malocclusion treatment, Bone-Anchored Maxillary Protraction (BAMP), and cephalometric AI diagnostics.');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Update in AuthContext & Cloud Firestore
      await updateUserProfile({
        name: data.name,
        email: data.email,
        role: data.role,
        specialization: data.specialization,
        hospitalName: data.hospitalName,
        phone: data.phone,
        bio: data.bio
      });

      // 2. Also send to backend API endpoint as secondary sync if backend is active
      try {
        await axios.put('/api/settings', {
          doctorName: data.name,
          email: data.email,
          role: data.role,
          specialization: data.specialization,
          hospitalName: data.hospitalName,
          phone: data.phone
        });
      } catch (e) {
        // Backend optional fallback warning ignored silently
      }

      toast.success("Doctor Profile updated and synced with Cloud Firestore!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left text-xs font-semibold">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workstation</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full text-[10px] font-extrabold flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Profile Verified</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Live Profile Preview Card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-bold tracking-wider text-medical-300 uppercase">
                  BAMP Credentials
                </span>
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-gradient-to-tr from-medical-500 to-indigo-500 text-white font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                  {watchedName ? watchedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DR'}
                </div>
                <h3 className="text-base font-extrabold mt-3 text-white leading-snug">
                  {watchedName || 'Dr. Venkatapraveenamallela'}
                </h3>
                <p className="text-[11px] font-bold text-medical-300 mt-0.5">
                  {watchedRole === 'Clinic Manager' ? 'Clinic Operations Manager' : 'Orthodontist Specialist'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {watchedSpecialization || 'Orthodontics & Dentofacial Orthopedics'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hospital:</span>
                <span className="font-bold truncate max-w-[140px]">{watchedHospital || 'Care Center'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-[9px] truncate max-w-[140px]">{watchedEmail || 'doctor@bamp.ai'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">UID:</span>
                <span className="font-mono text-[9px] text-emerald-400">{user?.uid ? user.uid.substring(0, 10) + '...' : 'ACTIVE-KEY'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editable Profile Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-2">
              <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-150">Edit Profile & Workstation Role</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Update your professional credentials, primary workstation role, and clinic contact details.
              </p>
            </div>

            {/* Role & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Doctor Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary System Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    {...register('role')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-bold text-xs"
                  >
                    <option value="Orthodontist">Orthodontist (Clinician)</option>
                    <option value="Clinic Manager">Clinic Manager (Management)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Specialization & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orthodontic Specialization</label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('specialization')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital / Medical Center</label>
                <div className="relative">
                  <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('hospitalName')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Bio / Specialty Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Bio & Specialty Notes</label>
              <textarea
                rows={3}
                {...register('bio')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 font-medium text-xs leading-relaxed resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-medical-500 hover:bg-medical-400 text-white font-bold rounded-2xl shadow-lg shadow-medical-500/20 flex items-center space-x-2 transition-all duration-150 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-4.5 w-4.5" />
                    <span>Save & Update Profile</span>
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

export default UserProfile;
