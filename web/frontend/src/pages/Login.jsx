import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      emailAddress: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data.emailAddress, data.password);
      toast.success(response.message || 'OTP verification code sent to your email.');
      setTimeout(() => {
        navigate('/otp-verify', { state: { email: data.emailAddress, demoOtp: response?.demoOtp } });
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Authentication request rejected.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast.success('Successfully authenticated via Google.');
        setTimeout(() => {
          navigate('/otp-verify', { state: { email: 'dr.venkat@hospital.org' } });
        }, 1200);
      }
    } catch (err) {
      toast.error(err.message || 'Google Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-darkbg dark:text-slate-100 p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-sans tracking-tight">Sign In</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">BAMP AI outcomes evaluation dashboard access</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="dr.venkat@hospital.org"
                  {...register('emailAddress', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address syntax'
                    }
                  })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium"
                />
              </div>
              {errors.emailAddress && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.emailAddress.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                <Link to="/forgot-password" name="forgot-password" id="forgot-password-link" className="text-xs font-semibold text-medical-500 hover:text-medical-400">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Continue Securely</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6 font-semibold text-slate-500">
            Need an account? <Link to="/signup" className="text-medical-500 hover:underline font-bold">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
