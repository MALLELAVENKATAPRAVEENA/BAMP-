import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX, Cpu, Bot, User } from 'lucide-react';
import axios from 'axios';

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am BAMP-AI. You can ask me medical questions regarding miniplates placement, elastic forces, age ranges, or growth patterns." }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Speech Recognition API reference
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Automatically submit transcription query
        handleSendQuery(transcript);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const speakText = (text) => {
    if (isMuted) return;
    // Strip markdown formatting prior to speaking out
    const cleanText = text.replace(/[*#_`-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    window.speechSynthesis.cancel(); // Stop any active voice readouts
    window.speechSynthesis.speak(utterance);
  };

  const handleSendQuery = async (queryText = input) => {
    const text = queryText.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { message: text });
      if (res.data.success) {
        const reply = res.data.reply;
        setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        speakText(reply);
      }
    } catch (err) {
      console.error("AI Assistant response failed:", err.message);
      setMessages(prev => [...prev, { role: 'assistant', text: "Apologies, the assistant network appears overloaded. Please verify configuration parameters." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      window.speechSynthesis.cancel(); // Stop talking before listening
      recognitionRef.current.start();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left font-sans text-xs">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden mb-4"
          >
            
            {/* Assistant Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-medical-600 to-indigo-650 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1 bg-white/10 rounded-lg">
                  <Cpu className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs">BAMP AI Specialist</h3>
                  <span className="text-[9px] text-slate-200">Active Guidance Node</span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
                  title={isMuted ? "Unmute vocal reader" : "Mute vocal reader"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat message loops */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${msg.role === 'user' ? 'bg-medical-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  
                  <div className={`p-3 rounded-2xl max-w-[75%] leading-relaxed font-semibold ${msg.role === 'user' ? 'bg-medical-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-tl-none text-slate-700 dark:text-slate-250'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-medical-500"></div>
                  <span className="font-bold text-[10px]">Processing calculations...</span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Actions area */}
            <div className="p-3.5 border-t border-slate-150/40 dark:border-slate-805/85 bg-white dark:bg-slate-900 flex items-center space-x-2">
              {/* Voice Rec mic button */}
              <button
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-455'}`}
                title={isListening ? "Listening..." : "Enable Voice Assistant Mic"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder={isListening ? 'Listening...' : 'Type medical question...'}
                disabled={isListening}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-medical-500 font-medium"
              />

              <button
                onClick={() => handleSendQuery()}
                className="p-2.5 bg-medical-500 hover:bg-medical-400 text-white rounded-xl transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-medical-500 to-indigo-650 text-white rounded-full shadow-2xl flex items-center justify-center border border-white/10"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default AIChatAssistant;
