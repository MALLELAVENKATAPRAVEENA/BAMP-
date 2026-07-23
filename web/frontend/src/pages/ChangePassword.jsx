import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Save, ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Security password updated successfully!");
      reset();
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left text-xs font-semibold">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center space-x-1 text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Settings</span>
        </button>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Change Workstation Password</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('oldPassword', { required: 'Current password is required' })}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
            {errors.oldPassword && <p className="text-xs text-rose-500 font-semibold">{errors.oldPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
            {errors.newPassword && <p className="text-xs text-rose-500 font-semibold">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', { required: 'Please confirm new password' })}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-500 font-semibold">{errors.confirmPassword.message}</p>}
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
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Update Workstation Password</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
