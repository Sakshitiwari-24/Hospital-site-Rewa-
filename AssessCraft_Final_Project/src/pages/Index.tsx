import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { companies } from "@/data/companies";
import { ArrowRight, Terminal, Brain, Lightbulb, Star, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

const floatingIcons = [
  { icon: Brain, delay: 0, x: [0, 20, 0], y: [0, -30, 0], scale: [1, 1.1, 1] },
  { icon: Lightbulb, delay: 2, x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.2, 1] },
  { icon: Star, delay: 4, x: [0, 30, 0], y: [0, 20, 0], scale: [1, 0.9, 1] },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-green-500 overflow-hidden relative cyber-grid font-mono">
      {/* Animated Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-green-500/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-24 relative">
          {/* Floating Icons */}
          {floatingIcons.map((item, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0 }}
               animate={{ 
                  opacity: 0.6,
                  x: item.x,
                  y: item.y,
                  scale: item.scale,
                  rotate: [0, 10, -10, 0]
               }}
               transition={{ 
                 duration: 10, 
                 delay: item.delay,
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
               className={`absolute hidden md:flex items-center justify-center surface-glass border border-green-500/30 p-4 rounded-2xl w-16 h-16 shadow-lg shadow-green-500/20
                  ${i === 0 ? 'top-20 left-10 text-green-400' : ''}
                  ${i === 1 ? 'top-60 right-20 text-emerald-400' : ''}
                  ${i === 2 ? 'bottom-20 left-1/4 text-green-300' : ''}
               `}
             >
                <item.icon className="w-8 h-8" />
             </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 border border-green-500/50 bg-green-500/10 px-6 py-2 rounded-full mb-8 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md"
            >
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-bold text-xs tracking-widest text-green-300 uppercase">
                Premium Placement Engine V2
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white"
            >
              Master Your Placements<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                With Machine Precision
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Dynamic question generation, real exam patterns, in-depth analytics, and gamified mastery. 
              Built for ambitious students who want to clear top-tier campus drives.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/test/exam?company=TCS&section=TCS_NQT_MOCK&count=50"
                className="group relative overflow-hidden rounded-xl bg-green-600 px-8 py-4 font-bold text-black transition-all hover:bg-green-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">Start TCS NQT Simulation <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-md px-8 py-4 font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
              >
                 View Your Dashboard <Trophy className="h-5 w-5 text-yellow-500" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Subject Grid */}
        <section className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Target Modules & Subjects</h2>
            <p className="text-slate-400">Master each section individually before taking the full mock</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {companies.slice(0, 4).map((c, i) => (
              <AnimatedCard key={c.id} className="p-6 cursor-pointer group flex flex-col h-full bg-black/60 backdrop-blur-xl border border-green-900 hover:border-green-500/50">
                <Link to={`/company/${c.id}`} className="flex flex-col h-full">
                   <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                      <Terminal className="w-6 h-6 text-green-400" />
                   </div>
                   <h3 className="text-xl font-bold text-green-100 mb-2 group-hover:text-green-400">{c.name}</h3>
                   <p className="text-sm text-green-800 mb-6 flex-1 line-clamp-3">{c.description}</p>
                   <div className="flex flex-wrap gap-2 mt-auto">
                      {c.sections.slice(0, 2).map((s) => (
                        <span key={s} className="text-[10px] font-bold text-green-300 bg-green-500/10 px-2 py-1 rounded-md uppercase">
                          {s.split(" ")[0]}
                        </span>
                      ))}
                   </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
