import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Award, Landmark, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || 'Dr. Venkatapraveenamallela',
      email: user?.email || 'dr.venkat@hospital.org',
      specialization: 'Orthodontics & Dentofacial Orthopedics',
      hospitalName: 'Advanced Orthodontic Care & AI Research Center'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.put('/api/settings', {
        doctorName: data.name,
        email: data.email,
        specialization: data.specialization,
        hospitalName: data.hospitalName
      });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left text-xs font-semibold">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-1 text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Doctor Profile Profile</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="h-12 w-12 bg-medical-500 text-white font-bold rounded-2xl flex items-center justify-center text-lg">
              DR
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-150">{user?.name || 'Dr. Venkatapraveenamallela'}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Orthodontist Specialist</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orthodontic Specialization</label>
            <div className="relative">
              <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('specialization')}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Affiliation</label>
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('hospitalName')}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserProfile;
