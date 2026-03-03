import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { 
  Search, ShieldCheck, Zap, Globe, 
  ArrowRight, MessageSquare, Phone, Mail,
  Star, Users, Layout, Shield
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartSearch = () => {
    // If logged in, go to chat/language, else go to login
    user ? navigate("/language") : navigate("/login");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* 1. Dynamic Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-20 py-4">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-10 w-10 bg-indigo-600 rounded-xl shadow-indigo-200 shadow-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Globe className="text-white" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-800">GovPortal<span className="text-indigo-600">.ai</span></span>
        </div>
        
        <div className="hidden md:flex gap-10 text-sm font-bold text-slate-500 items-center">
          <a href="#how-it-works" className="hover:text-indigo-600 transition">How it works</a>
          <a href="#schemes" className="hover:text-indigo-600 transition">Trending</a>
          <a href="#contact" className="hover:text-indigo-600 transition">Support</a>
          {!user ? (
            <button 
              onClick={() => navigate("/login")} 
              className="bg-slate-100 px-6 py-2.5 rounded-full hover:bg-slate-200 transition text-slate-700"
            >
              Sign In
            </button>
          ) : (
            <button 
              onClick={() => navigate("/chat")} 
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Dashboard
            </button>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="max-w-7xl mx-auto px-6 lg:px-20 pt-20 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full mb-8 uppercase tracking-[0.2em] border border-indigo-100">
              <Zap size={12} /> 2026 AI-Core Technology
            </div>
            <h1 className="text-7xl lg:text-8xl font-black leading-[0.95] mb-8 tracking-tighter text-slate-900">
              Your Benefits, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Simplified.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg font-medium">
              We've mapped over 2,500 government schemes to help you find the financial assistance and support you qualify for in under 60 seconds.
            </p>

            <div className="flex flex-wrap gap-8 items-center">
              <button 
                onClick={handleStartSearch}
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3 group text-lg"
              >
                Start Smart Search <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="user" />
                  </div>
                ))}
                <div className="h-12 w-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  +120k
                </div>
              </div>
            </div>
          </motion.div>

          {/* New Simplified Hero Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-[3.5rem] rotate-3 opacity-5 blur-2xl"></div>
            <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-50 relative z-10">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 mb-1">Secure Retrieval</h4>
                    <p className="text-slate-500 font-medium">Direct connection to official government databases via encrypted AI protocols.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                    <Layout size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 mb-1">Unified Dashboard</h4>
                    <p className="text-slate-500 font-medium">Track all your eligible schemes, documents, and deadlines in one single place.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Status</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-black text-slate-700">2,584 Schemes Online</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 3. "How it Works" Section */}
      <section id="how-it-works" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <motion.div {...fadeInUp} className="max-w-3xl mb-24">
            <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight">The bridge between you and your <span className="text-indigo-600">Rights.</span></h2>
            <p className="text-slate-500 text-xl font-medium">Our system is designed to remove the complexity of bureaucracy through intelligent matching.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={32} />, title: "Digital Identity", desc: "One-time secure verification that protects your personal data using government-grade encryption." },
              { icon: <Search size={32} />, title: "Smart Scan", desc: "Our RAG-based AI analyzes your unique criteria against current state and central policy datasets." },
              { icon: <Zap size={32} />, title: "Instant Access", desc: "Receive immediate eligibility reports and direct application routes without visiting a physical office." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                {...fadeInUp} 
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-12 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black mb-4">{item.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Schemes Category Section - UPDATED DESIGN */}
      <section id="schemes" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div {...fadeInUp}>
              <h2 className="text-5xl font-black tracking-tight mb-4">Trending Categories</h2>
              <p className="text-slate-500 text-lg font-medium">The most searched sectors in your region this month.</p>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={handleStartSearch}
              className="text-indigo-600 font-black flex items-center gap-2 border-b-2 border-indigo-600 pb-1"
            >
              Explore All 250+ Categories <ArrowRight size={18}/>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Education', count: '450+ Schemes', color: 'bg-blue-50 text-blue-600' },
              { name: 'Agriculture', count: '890+ Schemes', color: 'bg-emerald-50 text-emerald-600' },
              { name: 'Healthcare', count: '120+ Schemes', color: 'bg-rose-50 text-rose-600' },
              { name: 'Small Business', count: '340+ Schemes', color: 'bg-amber-50 text-amber-600' },
              { name: 'Housing', count: '60+ Schemes', color: 'bg-violet-50 text-violet-600' },
              { name: 'Pension', count: '15+ Schemes', color: 'bg-slate-50 text-slate-600' },
              { name: 'Startups', count: '90+ Schemes', color: 'bg-indigo-50 text-indigo-600' },
              { name: 'Women Empowerment', count: '210+ Schemes', color: 'bg-fuchsia-50 text-fuchsia-600' }
            ].map((cat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl cursor-pointer transition-all flex flex-col justify-between h-48"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black ${cat.color}`}>
                  {cat.name[0]}
                </div>
                <div>
                  <p className="font-black text-xl text-slate-800 mb-1">{cat.name}</p>
                  <p className="text-sm font-bold text-slate-400">{cat.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="py-32 bg-indigo-600 text-white rounded-[4rem] mx-6 lg:mx-20 mb-32 overflow-hidden relative shadow-3xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-500 opacity-50 skew-x-12 translate-x-20"></div>
        <div className="max-w-6xl mx-auto px-10 relative z-10 grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-6xl font-black mb-8 leading-tight tracking-tighter">Citizen Support <br /> Available 24/7.</h2>
            <p className="text-indigo-100 text-xl mb-12 font-medium">Struggling with a specific application? Our specialized consultants are here to help you navigate the paperwork.</p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest">Helpline</p>
                <span className="text-xl font-black">1800-GOV-AI</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest">Official Email</p>
                <span className="text-xl font-black">help@govportal.ai</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 lg:p-12 rounded-[3rem] shadow-2xl">
            <h3 className="text-slate-900 text-3xl font-black mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                placeholder="Your Full Name" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition text-slate-800 font-medium" 
              />
              <textarea 
                placeholder="Tell us about the scheme you're looking for..." 
                rows="4" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition text-slate-800 font-medium"
              ></textarea>
              <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-20">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">GP</div>
              <span className="font-black text-2xl tracking-tighter italic">GovPortal.ai</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium mb-8">
              Bridging the gap between the government and its citizens through advanced artificial intelligence.
            </p>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center justify-center cursor-pointer text-slate-400"><MessageSquare size={20}/></div>
               <div className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center justify-center cursor-pointer text-slate-400"><Globe size={20}/></div>
               <div className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center justify-center cursor-pointer text-slate-400"><Mail size={20}/></div>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32 w-full lg:w-auto">
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-8">Navigation</h5>
              <ul className="space-y-4 text-sm font-black text-slate-500">
                <li className="hover:text-indigo-600 cursor-pointer">Start Search</li>
                <li className="hover:text-indigo-600 cursor-pointer">Trending Schemes</li>
                <li className="hover:text-indigo-600 cursor-pointer">Calculator</li>
                <li className="hover:text-indigo-600 cursor-pointer">Help Center</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-8">Security</h5>
              <ul className="space-y-4 text-sm font-black text-slate-500">
                <li className="hover:text-indigo-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-indigo-600 cursor-pointer">Data Encryption</li>
                <li className="hover:text-indigo-600 cursor-pointer">Terms of Service</li>
                <li className="hover:text-indigo-600 cursor-pointer">Compliance</li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-8">Official Sources</h5>
              <p className="text-slate-400 text-xs font-bold leading-loose">
                Data compiled from state portals, central ministry releases, and official gazettes across 28 states.
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-16 mt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2026 GovPortal Technologies. Built for Citizens.</p>
          <div className="flex gap-8">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 cursor-pointer">System Status: Optimal</span>
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 cursor-pointer">v4.2.0 Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}