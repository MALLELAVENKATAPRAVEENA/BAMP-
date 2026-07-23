import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      fullName: '',
      emailAddress: 'dr.venkat@hospital.org', // Preconfigured test values
      password: 'password123'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // Run login endpoint
        const response = await login(data.emailAddress, data.password);
        toast.success(response.message || 'Verification code dispatched.');
        setTimeout(() => {
          navigate('/otp-verify', { state: { email: data.emailAddress } });
        }, 1200);
      } else {
        // Run signup endpoint
        const response = await signup(data.fullName, data.emailAddress, data.password);
        toast.success(response.message || 'OTP successfully sent to email.');
        setTimeout(() => {
          navigate('/otp-verify', { state: { email: data.emailAddress } });
        }, 1200);
      }
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
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-sans tracking-tight">BAMP AI Evaluation Portal</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Access clinical prediction and cephalometric tools</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl mb-8 max-w-xs mx-auto border border-slate-300/30">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isLogin ? 'bg-white text-medical-600 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Doctor Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${!isLogin ? 'bg-white text-medical-600 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Box Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Full Name (Sign Up only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Dr. Venkatapraveenamallela"
                      {...register('fullName', { required: !isLogin ? 'Name is required' : false })}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium"
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.fullName.message}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
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
                {isLogin && <button type="button" className="text-xs font-semibold text-medical-500 hover:text-medical-400">Forgot Password?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                  <span>{isLogin ? 'Continue Securely' : 'Sign Up Securely'}</span>
                </>
              )}
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Or secure access via</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-850 rounded-2xl flex items-center justify-center space-x-3 transition-colors duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.4 15 0 12 0 7.4 0 3.5 2.7 1.7 6.6l3.9 3C6.5 6.9 9 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.1-2 3.7-4.9 3.7-8.7z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.7 7.2c-.8 1.7-1.3 3.5-1.3 5.3s.5 3.6 1.3 5.3l3.9-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-.9 8-2.6l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-1.9-6.4-4.5L1.7 18.1C3.5 21.8 7.4 24 12 24z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
