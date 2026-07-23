import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailVerification = () => {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const emailAddress = location.state?.email || 'dr.venkat@hospital.org';

  const handleResendLink = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Verification link resend dispatched to: ${emailAddress}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-darkbg dark:text-slate-100 p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-medical-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/85 rounded-3xl p-8 shadow-xl shadow-slate-105 dark:shadow-none text-center">
          
          <div className="inline-flex items-center justify-center p-3.5 bg-medical-500/10 rounded-2xl mb-6">
            <Mail className="h-7 w-7 text-medical-500" />
          </div>

          <h2 className="text-2xl font-extrabold font-sans tracking-tight">Verify Your Email</h2>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-2 leading-relaxed">
            We sent a verification link to your email:
          </p>
          <p className="text-sm font-semibold text-medical-600 dark:text-medical-455 mt-1">{emailAddress}</p>
          <p className="text-xs text-slate-500 mt-4 leading-normal">
            Please check your inbox (and spam folder) and click the link to activate your orthodontics profile.
          </p>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate('/otp-verify', { state: { email: emailAddress } })}
              className="w-full py-4 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>I Have Verified My Email</span>
            </button>

            <button
              onClick={handleResendLink}
              disabled={isSending}
              className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-850 rounded-2xl flex items-center justify-center space-x-2 transition-all font-semibold text-xs disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Link</span>
            </button>
          </div>

          <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-750 mt-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Login</span>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
