import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { notoSansBase64, notoSansTamilBase64 } from "../utils/pdfFont";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ChatSidebar from "./ChatSidebar";

// 🔹 Language Detectors
const isTamilText = (text) => /[\u0B80-\u0BFF]/.test(text);
const isHindiText = (text) => /[\u0900-\u097F]/.test(text);

export default function Chat() {
  const { t, lang } = useLanguage();
  const { token, logout } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});


  const scrollRef = useRef(null);
  const handleLogout = () => {
    logout(); // This clears the token
    navigate("/"); // Redirects to home/login
  };

  /* =========================
      1. INITIAL LOAD: Get all sessions
  ========================= */
  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:8080/chat/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setSessions(res.data);
        // Don't auto-set activeSession here so the user can choose which one to open
      })
      .catch(console.error);
  }, [token]);

  /* =========================
      2. THE FIX: Fetch history when activeSession changes
  ========================= */
  useEffect(() => {
    if (activeSession && token) {
      axios.get(`http://localhost:8080/chat/session/${activeSession}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          const history = res.data.map((m) => ({
            id: m.id,
            role: m.role,
            text: m.message,
          }));
          // If history found, show it; otherwise show welcome
          setMessages(history.length > 0 ? history : [{ role: "bot", text: t.welcome }]);
        })
        .catch((err) => {
          console.error("History fetch error:", err);
          setMessages([{ role: "bot", text: "⚠️ Error loading history" }]);
        });
    }
  }, [activeSession, token]); // REMOVED t.welcome from here to prevent loops

  /* =========================
      3. LANGUAGE RESET: Only for new/empty chats
  ========================= */
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([{ role: "bot", text: t.welcome }]);
    }
  }, [lang, t.welcome]);


  /* =========================
     NEW CHAT
  ========================= */
  const handleNewChat = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/chat/new-session",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions((prev) => [res.data, ...prev]);
      setActiveSession(res.data.id);
      setMessages([{ role: "bot", text: t.welcome }]);
    } catch (e) {
      console.error("New chat failed", e);
    }
  };

  /* =========================
      DELETE CHAT
  ========================= */
  const handleDeleteChat = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/chat/session/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from UI list
      setSessions(prev => prev.filter(s => s.id !== id));
      // If we deleted the active chat, reset to the first available or null
      if (activeSession === id) {
        setActiveSession(sessions.length > 1 ? sessions[0].id : null);
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  /* =========================
      RENAME CHAT
  ========================= */
  const handleRenameChat = async (id, newTitle) => {
    try {
      await axios.put(`http://localhost:8080/chat/session/${id}`, newTitle, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        },
      });
      // Update the title in the UI list
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    } catch (e) {
      console.error("Rename failed", e);
    }
  };

  /* =========================
     WELCOME MESSAGE (LANG)
  ========================= */
  useEffect(() => {
    setMessages([{ role: "bot", text: t.welcome }]);
  }, [lang, t.welcome]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const send = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsTyping(true);

    let finalLanguage = lang;
    if (isTamilText(userText)) finalLanguage = "ta";
    else if (isHindiText(userText)) finalLanguage = "hi";

    try {
      const res = await axios.post(
        "http://localhost:8080/chat",
        {
          message: userText,
          language: finalLanguage,
          sessionId: activeSession,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        { id: res.data.messageId, role: "assistant", text: res.data.reply },

      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server Error" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* =========================
     PDF EXPORT
  ========================= */
  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.addFileToVFS("NotoSans.ttf", notoSansBase64);
    pdf.addFont("NotoSans.ttf", "NotoSans", "normal");

    pdf.addFileToVFS("NotoSansTamil.ttf", notoSansTamilBase64);
    pdf.addFont("NotoSansTamil.ttf", "NotoSansTamil", "normal");

    let y = 20;
    pdf.setFont("NotoSans");
    pdf.setFontSize(14);
    pdf.text("GovAssistant AI - Chat Transcript", 105, y, { align: "center" });
    y += 12;

    messages.forEach((msg) => {
      pdf.setFont(isTamilText(msg.text) ? "NotoSansTamil" : "NotoSans");
      const lines = pdf.splitTextToSize(
        `${msg.role === "user" ? "Citizen" : "Assistant"}: ${msg.text}`,
        170
      );

      if (y + lines.length * 7 > 280) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(lines, 20, y);
      y += lines.length * 7 + 5;
    });

    pdf.save("GovAssistant_Chat.pdf");
  };

  const handleFeedback = async (messageId, helpful) => {
    try {
      await axios.post(
        `http://localhost:8080/feedback/${messageId}?helpful=${helpful}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackGiven(prev => ({ ...prev, [messageId]: true }));
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };



  /* =========================
     UI
  ========================= */
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <ChatSidebar
        sessions={sessions}
        onSelect={setActiveSession}
        onNew={handleNewChat}
        onDelete={handleDeleteChat}
        onRename={handleRenameChat}
      />

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center px-8 justify-between">
          <span className="text-sm font-semibold text-slate-600">
            {t.assistantStatus}
          </span>

          <button
            onClick={downloadPDF}
            className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded"
          >
            Download Chat PDF
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-bold px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
          >
            Logout
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] p-5 rounded-3xl text-sm ${m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white border text-slate-800 rounded-tl-none"
                    }`}
                >
                  <p className="text-[15px] font-medium">{m.text}</p>

                  {/* 🔥 Show feedback only for assistant messages */}
                  {m.role === "assistant" && m.id && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleFeedback(m.id, true)}
                        className="text-green-600 hover:scale-110 transition"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleFeedback(m.id, false)}
                        className="text-red-600 hover:scale-110 transition"
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        <div className="p-6 bg-white border-t">
          <div className="max-w-4xl mx-auto relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.chatPlaceholder}
              className="w-full pl-6 pr-32 py-5 rounded-full bg-slate-100 outline-none"
            />
            <button
              onClick={send}
              className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-full font-bold"
            >
              {t.sendBtn}
            </button>
          </div>
        </div>
      </main>
    </div>
  );

}
