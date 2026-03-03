import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar({ onSelectSession, onNewChat }) {
  const [sessions, setSessions] = useState([]);
  const { token } = useAuth();

  // Fetch past chat sessions from your Spring Boot backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/chat/sessions", {
          headers: { Authorization: `Bearer ${token}` } // Auth header
        });
        setSessions(res.data); // Assuming backend returns list of { id, title, createdAt }
      } catch (err) {
        console.error("Could not fetch history", err);
      }
    };
    if (token) fetchHistory();
  }, [token]);

  return (
    <div className="w-72 bg-slate-900 h-screen flex flex-col border-r border-slate-800 transition-all duration-300">
      {/* 1. Header & New Chat Button */}
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all font-medium text-sm group"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
          New Consultation
        </button>
      </div>

      {/* 2. Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        <p className="px-3 pt-4 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Recent History
        </p>

        {sessions.length > 0 ? (
          sessions.map((session) => (
            <motion.div
              key={session.id}
              whileHover={{ x: 4 }}
              onClick={() => onSelectSession(session.id)}
              className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-700"
            >
              <div className="h-2 w-2 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-slate-300 truncate font-medium">
                  {session.title || "Untitled Search"}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-3 py-10 text-center">
            <p className="text-xs text-slate-600 italic">No past consultations found.</p>
          </div>
        )}
      </div>

      {/* 3. User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
            U
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">My Account</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">Verified User</p>
          </div>
        </div>
      </div>
    </div>
  );
}