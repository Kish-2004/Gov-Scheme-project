import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Details() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <form className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.detailsTitle}</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{t.ageLabel}</label>
            <input type="number" placeholder="25" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{t.locationLabel}</label>
            <input type="text" placeholder="Delhi" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
          </div>
        </div>

        <button onClick={() => navigate("/chat")} className="w-full mt-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition">
          {t.continueBtn}
        </button>
      </form>
    </div>
  );
}