import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Timer, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OTPVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const emailAddress = location.state?.email || 'dr.venkat@hospital.org';
  const demoOtp = location.state?.demoOtp;

  // Auto-fill demo OTP if available
  const handleAutoFill = () => {
    if (demoOtp && demoOtp.length === 6) {
      setOtp(demoOtp.split(''));
    }
  };

  // Timer loop
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Focus management
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input box
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyOtp(emailAddress, code);
      if (success) {
        toast.success('Identity verified successfully.');
        setTimeout(() => {
          navigate('/access-selection');
        }, 1200);
      }
    } catch (err) {
      toast.error(err.message || 'Verification rejected. Check code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await login(emailAddress, 'password123'); // Triggers resend
      setTimeLeft(60);
      setOtp(new Array(6).fill(''));
      toast.info('New verification OTP code dispatched to email.');
      inputRefs.current[0].focus();
    } catch (err) {
      toast.error(err.message || 'Resend request failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-darkbg dark:text-slate-100 p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full bg-medical-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none text-center">
          
          <div className="inline-flex items-center justify-center p-3.5 bg-medical-500/10 border border-medical-500/20 rounded-2xl mb-6">
            <ShieldCheck className="h-8 w-8 text-medical-500" />
          </div>

          <h2 className="text-2xl font-extrabold font-sans tracking-tight">Verify Your Identity</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Enter the 6-digit OTP sent to your registered email:
          </p>
          <p className="text-sm font-semibold text-medical-600 dark:text-medical-400 mt-1">{emailAddress}</p>

          {demoOtp && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-left text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-600 dark:text-amber-400">Demo Verification OTP</span>
                  <span className="font-mono text-base font-extrabold text-amber-900 dark:text-amber-200">{demoOtp}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Auto-fill Code
                </button>
              </div>
              <p className="mt-1 text-[11px] opacity-80">* Set SMTP credentials in backend/.env to dispatch real emails.</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={el => inputRefs.current[index] = el}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => e.target.select()}
                  className="w-12 h-14 text-center font-bold text-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              ))}
            </div>

            {/* Countdown / Resend Option */}
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              {timeLeft > 0 ? (
                <>
                  <Timer className="h-4 w-4 text-medical-500" />
                  <span>Resend code in <span className="font-semibold text-slate-700 dark:text-slate-300">{timeLeft}s</span></span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center space-x-1.5 font-semibold text-medical-500 hover:text-medical-400 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend OTP Code</span>
                </button>
              )}
            </div>

            {/* Submit Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
