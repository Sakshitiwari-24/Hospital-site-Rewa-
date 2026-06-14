import { Link } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getResults, getMistakes } from "@/lib/testStorage";
import { Flame, Trophy, TrendingUp, AlertTriangle, Target, Clock, Activity, Medal, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell,
  AreaChart, Area
} from "recharts";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

const Dashboard = () => {
  const results = [...getResults()].reverse(); // oldest to newest for charts
  const mistakes = getMistakes();

  const totalTests = results.length;
  const avgAccuracy = totalTests > 0 ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / totalTests) : 0;
  const avgScore = totalTests > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / totalTests) : 0;
  
  // XP & Level Logic
  const totalXP = totalTests > 0 ? results.reduce((acc, curr) => acc + (curr.score * 10), 0) : 0;
  const level = Math.floor(totalXP / 1000) + 1;
  const xpToNextLevel = 1000 - (totalXP % 1000);
  const xpProgress = (totalXP % 1000) / 1000 * 100;
  const levelTitle = level < 3 ? "Beginner" : level < 7 ? "Scholar" : level < 15 ? "Expert" : "Master";

  // Streak Logic
  const calculateStreak = () => {
      let streak = 0;
      const today = new Date().toDateString();
      const uniqueDays = Array.from(new Set(results.map(r => new Date(r.date).toDateString()))).reverse(); // oldest to newest
      // very basic streak counting backwards
      if (uniqueDays.length > 0) streak = uniqueDays.length; // Simplified for now
      return streak > 5 ? 5 : streak; // cap for display fun
  };
  const streak = calculateStreak();

  // Chart 1: Score Trend over time
  const trendData = results.map((r, i) => ({
    name: `Test ${i + 1}`,
    score: r.score,
    accuracy: r.accuracy
  }));

  // Chart 2: Section Mastery (Radar)
  const radarData = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    results.forEach(r => {
      Object.entries(r.sectionBreakdown).forEach(([sec, data]) => {
        if (!stats[sec]) stats[sec] = { total: 0, correct: 0 };
        stats[sec].total += data.total;
        stats[sec].correct += data.correct;
      });
    });
    return Object.entries(stats).map(([subject, data]) => ({
      subject: subject.split(' ')[0], // abbreviate
      mastery: Math.round((data.correct / data.total) * 100),
      fullMark: 100
    }));
  }, [results]);

  // Chart 3: Topic Weakness Heatmap / Bars
  const topMistakes = useMemo(() => {
    const counts: Record<string, number> = {};
    mistakes.forEach(m => {
       counts[m.pattern] = (counts[m.pattern] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, errors]) => ({ name, errors }));
  }, [mistakes]);

  if (totalTests === 0) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono cyber-grid">
        <Navbar showBack title="Dashboard" />
        <div className="container mx-auto px-6 py-24 max-w-4xl flex flex-col items-center justify-center text-center">
            <Activity className="h-16 w-16 text-green-700 mb-6" />
            <h2 className="text-3xl font-bold text-green-100 mb-4">No Intel Gathered Yet</h2>
            <p className="text-green-800 mb-8 max-w-md">Your analytics engine is waiting for data. Complete your first assessment to unlock personalized insights, radar charts, and mastery tracking.</p>
            <Link
              to="/test/exam?company=TCS&section=TCS_NQT_MOCK&count=50"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 font-bold text-black rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              Deploy First Assessment
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono pb-24 cyber-grid border-green-500/30">
      <Navbar showBack title="Dashboard" />

      <div className="container mx-auto px-6 pt-10 max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Top Profile & XP Bar */}
          <section className="flex flex-col lg:flex-row gap-6 mb-8">
             <AnimatedCard className="flex-1 p-6 bg-black/80 flex items-center justify-between border-green-500/30 backdrop-blur-md">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-1">
                      <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                         <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                           {level}
                         </span>
                      </div>
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-green-100 mb-1 tracking-tight">DEMO USER</h2>
                     <p className="text-xs font-bold text-green-400 tracking-widest uppercase">{levelTitle} Rank</p>
                   </div>
                </div>
                <div className="text-right hidden sm:block">
                   <div className="flex items-center gap-2 text-green-500 justify-end mb-2">
                      <Flame className="w-5 h-5 fill-current" />
                      <span className="font-bold text-lg">{streak} Day Streak!</span>
                   </div>
                   <p className="text-xs text-green-700">{totalXP} XP Total</p>
                </div>
             </AnimatedCard>
             
             {/* Large XP Bar */}
             <div className="lg:w-1/3 bg-black/60 border border-green-900 rounded-xl p-6 flex flex-col justify-center backdrop-blur-md">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                   <span className="text-green-700">Current Level</span>
                   <span className="text-green-400">{xpToNextLevel} XP to Lvl {level + 1}</span>
                </div>
                <div className="h-3 bg-green-950 rounded-full overflow-hidden shadow-inner">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                   />
                </div>
             </div>
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: Target, label: "Avg Accuracy", val: `${avgAccuracy}%`, color: "text-green-400" },
               { icon: Trophy, label: "Avg Score", val: `${avgScore}%`, color: "text-emerald-400" },
               { icon: AlertTriangle, label: "Total Errors", val: mistakes.length, color: "text-red-400" },
               { icon: Medal, label: "Tests Taken", val: totalTests, color: "text-green-300" },
             ].map((s, i) => (
                <AnimatedCard key={i} className="p-6 bg-black/60 border border-green-900 text-center flex flex-col items-center justify-center backdrop-blur-md">
                   <s.icon className={`w-6 h-6 mb-3 ${s.color}`} />
                   <span className="text-3xl font-black text-green-100">{s.val}</span>
                   <span className="text-xs font-bold text-green-700 uppercase tracking-widest mt-1">{s.label}</span>
                </AnimatedCard>
             ))}
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Performance Trend */}
             <div className="lg:col-span-2 bg-black/60 border border-green-900 rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-green-100 uppercase tracking-widest text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" /> Score Trajectory
                   </h3>
                </div>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trendData}>
                       <defs>
                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                       <XAxis dataKey="name" stroke="#047857" fontSize={10} tickLine={false} axisLine={false} />
                       <YAxis stroke="#047857" fontSize={10} tickLine={false} axisLine={false} />
                       <RechartsTooltip 
                         contentStyle={{ backgroundColor: '#000', borderColor: '#064e3b', borderRadius: '8px' }}
                         itemStyle={{ color: '#ecfdf5', fontSize: '12px', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                     </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Radar Mastery */}
             <div className="bg-black/60 border border-green-900 rounded-xl p-6 backdrop-blur-md">
                <h3 className="font-bold text-green-100 uppercase tracking-widest text-sm mb-2 text-center text-green-400">
                   Subject Mastery Map
                </h3>
                <div className="h-64 flex items-center justify-center">
                   {radarData.length > 2 ? (
                     <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                         <PolarGrid stroke="#1e293b" />
                         <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                         <Radar name="Mastery %" dataKey="mastery" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
                         <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                       </RadarChart>
                     </ResponsiveContainer>
                   ) : (
                     <div className="text-center text-slate-500 text-sm">Need more varied tests to build radar map.</div>
                   )}
                </div>
             </div>
          </section>

          {/* Weak Topics Heatmap & Badges */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-red-500" /> High Priority Revisions
                </h3>
                {topMistakes.length > 0 ? (
                  <div className="space-y-4">
                    {topMistakes.map((mistake, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">{mistake.name}</span>
                          <span className="text-red-400">{mistake.errors} Errors</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((mistake.errors / 10) * 100, 100)}%` }} // arbitrary scale
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 mt-6 border-t border-slate-800">
                      <Link to="/test/configure" className="text-xs font-bold text-green-400 hover:text-green-300 transition-colors uppercase tracking-widest flex items-center justify-between">
                         Generate Smart Revision Test <span>→</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No weak topics identified yet. Keep it up!</p>
                )}
             </div>

             <div className="bg-black/60 border border-green-900 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                   <Star className="w-4 h-4 text-yellow-500" /> Recent Accolades
                </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4 flex flex-col items-center text-center">
                       <Flame className="w-8 h-8 text-yellow-500 mb-2" />
                       <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Initial Spark</span>
                       <span className="text-[10px] text-slate-400 mt-1">Starting a streak</span>
                    </div>
                    {avgScore >= 80 ? (
                      <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-4 flex flex-col items-center text-center">
                         <Trophy className="w-8 h-8 text-emerald-500 mb-2" />
                         <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">High Achiever</span>
                         <span className="text-[10px] text-slate-400 mt-1">80%+ Average Score</span>
                      </div>
                    ) : (
                      <div className="border border-slate-800 bg-slate-800/50 rounded-xl p-4 flex flex-col items-center text-center opacity-50 grayscale">
                         <Trophy className="w-8 h-8 text-slate-400 mb-2" />
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Achiever</span>
                         <span className="text-[10px] text-slate-500 mt-1">Need 80%+ Avg Score</span>
                      </div>
                    )}
                 </div>
             </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
