import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { TestResult } from "@/lib/testStorage";
import { CheckCircle, XCircle, Clock, Target, TrendingUp, RotateCcw, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

const CircularProgress = ({ value, color }: { value: number, color: string }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrentValue(value);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const circleLength = 283; // 2 * pi * 45
  const strokeDashoffset = circleLength - (circleLength * currentValue) / 100;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-slate-800" />
        <motion.circle
          cx="50" cy="50" r="45" fill="none" strokeWidth="8"
          className={color}
          strokeDasharray={circleLength}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white">{currentValue}%</span>
        <span className="text-sm font-bold text-slate-400">SCORE</span>
      </div>
    </div>
  );
};

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as TestResult | undefined;

  useEffect(() => {
    if (result && result.score >= 70) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#ffffff']
        });
      }, 500);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 cyber-grid font-mono">
        <p className="font-mono text-green-700">No results found.</p>
        <Link to="/" className="text-green-400 hover:underline font-bold text-xs uppercase tracking-widest">Back to home</Link>
      </div>
    );
  }

  const avgTime = result.timePerQuestion.length > 0
    ? Math.round(result.timePerQuestion.reduce((s, t) => s + t, 0) / result.timePerQuestion.length)
    : 0;

  const isPass = result.score >= 70;
  const isWarn = result.score >= 40 && result.score < 70;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono cyber-grid border-green-500/30">
      <Navbar showBack title="Assessment Results" />

      <div className="container mx-auto px-6 py-12 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">

          {/* Main Score Area */}
          <div className="relative overflow-hidden border border-green-900 bg-black/60 backdrop-blur-xl rounded-2xl p-10 flex flex-col items-center text-center shadow-2xl">
            <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isPass ? 'bg-green-500' : isWarn ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <div className={`absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isPass ? 'bg-emerald-500' : isWarn ? 'bg-yellow-600' : 'bg-red-600'}`} />

            <CircularProgress value={result.score} color={isPass ? "stroke-green-500" : isWarn ? "stroke-yellow-500" : "stroke-red-500"} />

            <h2 className={`mt-8 text-3xl font-black uppercase tracking-widest ${isPass ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500' : isWarn ? 'text-yellow-400' : 'text-red-500'}`}>
              {isPass ? "Assessment Passed" : isWarn ? "Needs Improvement" : "Assessment Failed"}
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
              You correctly answered {result.correctAnswers} out of {result.totalQuestions} questions in the {result.difficulty} {result.section} assessment.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle, label: "Correct", value: result.correctAnswers, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { icon: XCircle, label: "Incorrect", value: result.totalQuestions - result.correctAnswers, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { icon: Target, label: "Accuracy", value: `${result.accuracy}%`, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: Clock, label: "Avg Time", value: `${avgTime}s`, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            ].map((stat) => (
              <div key={stat.label} className={`border p-6 rounded-2xl flex flex-col items-center text-center shadow-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 mb-3 ${stat.color}`} />
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Section Breakdown */}
          {Object.keys(result.sectionBreakdown).length > 0 && (
            <div className="border border-green-900 bg-black/60 backdrop-blur-md rounded-2xl p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Section Breakdown
              </h3>
              <div className="space-y-6">
                {Object.entries(result.sectionBreakdown).map(([sec, data], idx) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={sec}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-300 text-sm">{sec}</span>
                        <span className="text-xs font-bold text-slate-400">
                          {data.correct}/{data.total} <span className={pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400'}>({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                          className={`h-full rounded-full ${pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500"} shadow-[0_0_10px_rgba(currentColor,0.5)]`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mistakes List */}
          {result.mistakes.length > 0 && (
            <div className="border border-green-900 bg-black/60 backdrop-blur-md rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Error Log
                </h3>
                <button className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                  Retry Wrong Questions
                </button>
              </div>

              <div className="space-y-4">
                {result.mistakes.slice(0, 5).map((m, i) => (
                  <div key={i} className="border border-slate-800 p-5 bg-[#0B1120] rounded-xl hover:border-slate-700 transition-colors">
                    <p className="text-sm text-slate-300 mb-4 whitespace-pre-wrap leading-relaxed font-medium">{m.questionText}</p>
                    <div className="flex flex-wrap gap-3 text-xs font-bold">
                      <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-md flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Selected: {m.selectedAnswer || 'Skipped'}
                      </span>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Correct: {m.correctAnswer}
                      </span>
                      <span className="border border-slate-700 text-slate-400 px-3 py-1.5 rounded-md">
                        {Math.round(m.timeSpent)}s Used
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate(`/test/configure?company=${result.company}&section=${encodeURIComponent(result.section)}`)}
              className="flex items-center justify-center gap-2 bg-slate-800 text-white rounded-xl px-4 py-4 font-bold text-sm hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <RotateCcw className="h-4 w-4" /> Retry Assessment
            </button>
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-black rounded-xl px-4 py-4 font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              Go to Dashboard
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default TestResults;
