import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      q: 'What is the optimal skeletal age for BAMP treatment?',
      a: 'The peak response period is between 10 to 12 years (late mixed dentition). Sutural margins are active and responsive to heavy intermaxillary vectors.',
      open: true
    },
    {
      q: 'How do you configure initial elastics tension forces?',
      a: 'Initial orthopedic traction starts at 150g per side immediately post-insertion. We recommend scaling force to 250g per side after 4 weeks of osseointegration monitoring.',
      open: false
    },
    {
      q: 'Does BAMP require full time elastics compliance?',
      a: 'Yes. Elastics must be worn 24 hours a day, including during sleep, and should be changed at least twice daily to maintain constant force vectors.',
      open: false
    }
  ]);

  const toggleFaq = (idx) => {
    setFaqs(prev =>
      prev.map((item, i) => (i === idx ? { ...item, open: !item.open } : item))
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left text-xs font-semibold">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
        <p className="text-xs text-slate-500 mt-1">Quick clinical reference guide on BAMP orthodontic vectors.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            onClick={() => toggleFaq(idx)}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4.5 rounded-2xl cursor-pointer hover:border-slate-350 dark:hover:border-slate-800 transition-colors"
          >
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">{faq.q}</h4>
              {faq.open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {faq.open && (
              <p className="text-slate-500 dark:text-slate-450 leading-relaxed mt-3.5 font-medium border-t border-slate-100 dark:border-slate-850 pt-3">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
