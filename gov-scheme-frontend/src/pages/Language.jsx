import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Language() {
  const navigate = useNavigate();
  const { setLang } = useLanguage();

  const handleSelect = (code) => {
    setLang(code);
    navigate("/details");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Select Language</h2>
        <p className="text-slate-500 mb-12">Choose your preferred language to continue</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'English', native: 'English', code: 'en' },
            { name: 'Hindi', native: 'हिन्दी', code: 'hi' },
            { name: 'Tamil', native: 'தமிழ்', code: 'ta' }
          ].map((l) => (
            <motion.button
              key={l.code}
              whileHover={{ scale: 1.05, borderColor: '#4f46e5' }}
              onClick={() => handleSelect(l.code)}
              className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 transition-all group"
            >
              <span className="text-3xl font-bold text-slate-800 block mb-1 group-hover:text-indigo-600">{l.native}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{l.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}