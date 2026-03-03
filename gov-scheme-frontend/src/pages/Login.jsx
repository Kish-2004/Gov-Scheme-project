import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { Mail, Lock, ArrowRight, Chrome, Github, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8080/auth/login`, formData);
      if (res.data.token) {
        login(res.data.token, res.data.email);
        navigate("/language", { replace: true });
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* --- Left Side: Branding (Indigo Section) --- */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative items-center justify-center p-20 overflow-hidden">
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
            Welcome back to <br /> <span className="text-indigo-200">GovAssistant.</span>
          </h1>
          <p className="text-xl text-indigo-100 font-medium max-w-md leading-relaxed">
            Securely access your personalized dashboard and track your government scheme applications.
          </p>
        </motion.div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Sign In</h2>
            <p className="text-slate-500 font-medium text-lg">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block group-focus-within:text-indigo-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={20} />
                <input
                  type="email" name="email" required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block group-focus-within:text-indigo-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={20} />
                <input
                  type="password" name="password" required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.25rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In Now"}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex justify-center text-xs uppercase mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition font-bold text-slate-600">
                <Chrome size={20} /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition font-bold text-slate-600">
                <Github size={20} /> Github
              </button>
            </div>
          </div>

          <p className="text-center mt-10 text-slate-500 font-medium">
            Don't have an account? 
            <Link to="/register" className="ml-2 text-indigo-600 font-black hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}