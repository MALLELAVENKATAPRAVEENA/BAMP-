import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Send, Phone, MapPin } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Thank you! Your message has been sent to technical support.");
      reset();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Contact System Support</h2>
        <p className="text-xs text-slate-500 mt-1">Get in touch with orthodontic and software development administrators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Support coordinates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between text-xs font-semibold">
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2">Support Desk</h3>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-medical-500 flex-shrink-0" />
              <div>
                <p className="font-bold">Technical Email</p>
                <p className="text-slate-450 mt-0.5">support@bamp-ai-predictor.org</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-indigo-500 flex-shrink-0" />
              <div>
                <p className="font-bold">Support Line</p>
                <p className="text-slate-450 mt-0.5">+91 99999 88888</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-teal-500 flex-shrink-0" />
              <div>
                <p className="font-bold">Clinic Head Office</p>
                <p className="text-slate-450 mt-0.5 leading-normal">Advanced Orthodontic Care & AI Research Center, Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400">
            * Standard query response turnaround is 24-48 business hours.
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  placeholder="Dr. Venkatapraveenamallela"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
                />
                {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  placeholder="dr.venkat@hospital.org"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
                />
                {errors.email && <p className="text-xs text-rose-500 font-semibold">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                placeholder="Database Integration Query"
                {...register('subject', { required: 'Subject is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none"
              />
              {errors.subject && <p className="text-xs text-rose-500 font-semibold">{errors.subject.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Description</label>
              <textarea
                rows="4"
                placeholder="Type your support request details here..."
                {...register('message', { required: 'Message is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none font-semibold text-sm"
              />
              {errors.message && <p className="text-xs text-rose-500 font-semibold">{errors.message.message}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-400 hover:to-medical-500 text-white font-semibold rounded-2xl shadow-lg shadow-medical-500/10 flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
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

export default Contact;
