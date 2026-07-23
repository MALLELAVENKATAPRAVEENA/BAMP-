import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, ShieldCheck, ArrowLeft, Key } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const emailAddress = location.state?.email || 'dr.venkat@hospital.org';

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully! Please log in with your new credentials.");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-darkbg dark:text-slate-100 p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-medical-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/85 rounded-3xl p-8 shadow-xl shadow-slate-105 dark:shadow-none text-center">
          
          <div className="inline-flex items-center justify-center p-3.5 bg-medical-500/10 rounded-2xl mb-6">
            <Key className="h-7 w-7 text-medical-500" />
          </div>

          <h2 className="text-2xl font-extrabold font-sans tracking-tight">Reset Password</h2>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-2 leading-relaxed">
            Enter the reset token sent to <span className="font-semibold text-medical-600 dark:text-medical-400">{emailAddress}</span> and specify a new secure password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 text-left font-semibold text-xs">
            
            {/* Reset Token */}
            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-slate-500">Reset Verification Code</label>
              <input
                type="text"
                placeholder="6-digit code"
                {...register('code', { required: 'Verification code is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
              />
              {errors.code && <p className="text-xs text-rose-500 font-semibold">{errors.code.message}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-slate-500">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-slate-500">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', { required: 'Confirm new password is required' })}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-500 font-semibold">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>

          </form>

          <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 mt-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel and Return</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
