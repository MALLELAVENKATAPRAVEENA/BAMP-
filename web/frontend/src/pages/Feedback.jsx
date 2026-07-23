import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, Send, Check } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Feedback = () => {
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Feedback submitted! Thank you for helping improve the platform.");
      reset();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left text-xs font-semibold">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Workstation Feedback</h2>
        <p className="text-xs text-slate-500 mt-1">Share your experience to refine clinical model features.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Visual stars ratings */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interface Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1.5 rounded-lg border transition-colors ${rating >= star ? 'bg-amber-500/10 border-amber-300 text-amber-500' : 'border-slate-200 text-slate-300'}`}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comment or suggestion</label>
            <textarea
              rows="4"
              placeholder="What could we optimize about landmark tracking or predictions calculators?"
              {...register('comments', { required: true })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none font-semibold text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Feedback;
