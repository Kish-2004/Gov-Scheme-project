import { motion } from 'framer-motion';

export default function SchemeCard({ scheme }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-blue-300"
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-50 transition-all group-hover:bg-blue-100" />
      
      <div className="relative z-10">
        <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded mb-2">
          Government Approved
        </span>
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition">
          {scheme.name}
        </h3>
        
        <div className="space-y-3 text-sm border-t pt-3 border-slate-100">
          <div className="flex items-center text-slate-600">
            <span className="font-semibold w-24">Eligibility:</span>
            <span className="bg-slate-50 px-2 py-1 rounded">{scheme.eligibility}</span>
          </div>
          <div className="flex items-start text-slate-600">
            <span className="font-semibold w-24 shrink-0">Benefits:</span>
            <span className="text-slate-800 leading-relaxed">{scheme.benefits}</span>
          </div>
        </div>

        <button className="mt-6 w-full py-2 rounded-lg bg-slate-900 text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          View Application Process →
        </button>
      </div>
    </motion.div>
  );
}