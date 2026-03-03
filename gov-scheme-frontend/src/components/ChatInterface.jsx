import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Install: npm install framer-motion
import axios from 'axios';
import SchemeCard from './SchemeCard';

const ChatInterface = () => {
    const [step, setStep] = useState(1); 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSchemeSearch = async (details) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/chatbot', { 
                message: `Find schemes for ${details.age} year old in ${details.location}` 
            });
            // Assuming reply might contain an array of schemes
            setMessages([...messages, { role: 'bot', content: response.data.reply, schemes: response.data.schemes }]);
            setStep(3);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            {/* 1. SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col">
                <h1 className="text-xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    GovAssist AI
                </h1>
                <nav className="flex-1 space-y-2">
                    <div className="p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition">New Search</div>
                    <div className="p-3 opacity-50 text-sm">HISTORY</div>
                    <div className="text-xs text-slate-500 px-3 italic text-wrap">Recent search for "Pension Schemes"...</div>
                </nav>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header/Stepper */}
                <header className="p-4 border-b bg-white flex justify-between items-center">
                    <div className="flex space-x-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 w-12 rounded ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-slate-500">Step {step} of 3</span>
                </header>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="max-w-md w-full text-center mt-12"
                            >
                                <h2 className="text-3xl font-bold mb-6">Welcome. Choose your language.</h2>
                                {/* Replace with your LanguageSelector component */}
                                <div className="grid grid-cols-2 gap-4">
                                    {['English', 'Hindi', 'Tamil', 'Marathi'].map(l => (
                                        <button key={l} onClick={() => setStep(2)} className="p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition shadow-sm">
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-lg"
                            >
                                <h3 className="text-xl font-semibold mb-4 text-center">Tell us about yourself</h3>
                                {/* Your DemographicsForm would go here */}
                                <button onClick={() => handleSchemeSearch({age: 25, location: 'Delhi'})} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                                    Find Available Schemes
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <div className="w-full max-w-4xl space-y-6">
                                {messages.map((m, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                                        <div className="bg-blue-100 p-4 rounded-2xl rounded-bl-none max-w-2xl mb-4">
                                            {m.content}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Mapping results into cards */}
                                            <SchemeCard scheme={{name: "PM-Kisan", eligibility: "Small Farmers", benefits: "₹6000/year"}} />
                                            <SchemeCard scheme={{name: "Ujjwala Yojana", eligibility: "BPL Families", benefits: "Free LPG Connection"}} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Feedback Bar */}
                <footer className="p-4 bg-slate-50 border-t flex justify-center items-center space-x-4">
                   <p className="text-sm text-slate-600">Was this helpful?</p>
                   <div className="flex space-x-2 text-xl cursor-pointer">
                       <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                   </div>
                </footer>
            </main>
        </div>
    );
};

export default ChatInterface;