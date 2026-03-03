import React, { useState } from "react";
import { MoreVertical, Trash2, Edit2, Check, X } from "lucide-react";

export default function ChatSidebar({ sessions, onSelect, onNew, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  return (
    <aside className="w-72 bg-slate-900 flex flex-col p-6 h-full">
      
      <div className="text-white font-bold text-lg mb-6">GovAssistant AI</div>

      <button onClick={onNew} className="mb-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
        + New Consultation
      </button>
      

      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {sessions.map((s) => (
          <div key={s.id} className="group relative flex items-center">
            {editingId === s.id ? (
              <div className="flex items-center w-full bg-slate-800 rounded-lg p-1">
                <input
                  className="bg-transparent text-white text-sm w-full outline-none px-2"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  autoFocus
                />
                <button onClick={() => { onRename(s.id, tempTitle); setEditingId(null); }} className="text-green-500 p-1"><Check size={14}/></button>
                <button onClick={() => setEditingId(null)} className="text-red-500 p-1"><X size={14}/></button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onSelect(s.id)}
                  className="w-full text-left px-3 py-3 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 truncate transition-all pr-12"
                >
                  {s.title || "Untitled Chat"}
                </button>
                
                {/* Action Icons - Visible on Hover */}
                <div className="absolute right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 rounded-md p-1">
                  <button 
                    onClick={() => { setEditingId(s.id); setTempTitle(s.title); }} 
                    className="text-slate-400 hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(s.id)} 
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
    
  );
}