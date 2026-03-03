import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Optional: multi-step flow for better UX
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/auth/register", formData);
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setStep(2); // Move to success state
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">

      {/* --- Left Side: Branding & Trust (Desktop Only) --- */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative items-center justify-center p-20 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] border-[40px] border-white rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[100px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-white"
        >
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block border border-white/20">
            <ShieldCheck size={48} className="text-indigo-200" />
          </div>
          <h1 className="text-6xl font-black leading-tight mb-6">
            Join the future of <br /> <span className="text-indigo-200">Governance.</span>
          </h1>
          <ul className="space-y-6">
            {[
              "Personalized scheme matching in seconds",
              "Secure, encrypted document handling",
              "24/7 AI-powered citizen support",
              "Real-time updates on new state policies"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-4 text-lg font-medium text-indigo-50">
                <CheckCircle2 size={24} className="text-green-400" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* --- Right Side: Registration Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
                  <p className="text-slate-500 font-medium text-lg">Sign up to get started with GovAssistant.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Username Field */}
                  <div className="group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={20} />
                      <input
                        type="text" required
                        placeholder="e.g., John Doe"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={20} />
                      <input
                        type="email" required
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={20} />
                      <input
                        type="password" required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.25rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Initializing..." : "Register Now"}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="mt-10 flex flex-col items-center gap-4">
                  <p className="text-slate-500 font-medium">
                    Already registered? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              // --- Success State Animation ---
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Success!</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Your account is ready. <br /> Redirecting you to login...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}