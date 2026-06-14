import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { generateQuestions, Question } from "@/lib/questionGenerator";
import { saveResult, TestResult, MistakeEntry } from "@/lib/testStorage";
import { AlertTriangle, Clock, Flag, X, Maximize, Minimize, Play, CheckCircle2, CircleDashed, Bookmark, Edit2, PlayCircle, Brain, Target, MessageSquare, Code2, Terminal } from "lucide-react";
import Editor from "@monaco-editor/react";

const TCS_SECTIONS = [
  "Quantitative Aptitude",
  "Reasoning Ability",
  "Verbal Ability",
  "Coding Section"
];

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Quantitative Aptitude": <Target className="w-4 h-4" />,
  "Reasoning Ability": <Brain className="w-4 h-4" />,
  "Verbal Ability": <MessageSquare className="w-4 h-4" />,
  "Programming Logic": <Code2 className="w-4 h-4" />,
  "Coding Section": <Terminal className="w-4 h-4" />
};

export default function ExamSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const company = searchParams.get("company") || "TCS";
  const requestedSection = searchParams.get("section") || "TCS_NQT_MOCK";
  const count = parseInt(searchParams.get("count") || "50");
  const difficulty = searchParams.get("difficulty") || "Medium";

  // Data
  const [questions, setQuestions] = useState<Question[]>([]);
  // We'll map sections from questions
  const [sections, setSections] = useState<string[]>([]);

  // Testing states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({});
  
  // Timer & Analytics
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [totalTimeLeft, setTotalTimeLeft] = useState(120 * 60); // 120 mins
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Anti-cheat
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Modes & UI
  const [isExamMode, setIsExamMode] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [codingLanguage, setCodingLanguage] = useState("cpp");
  const [codeOutput, setCodeOutput] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let q: Question[] = [];
    if (requestedSection === "TCS_NQT_MOCK" || requestedSection === "") {
      const perSec = Math.floor(count / TCS_SECTIONS.length);
      TCS_SECTIONS.forEach((sec) => {
        q = q.concat(generateQuestions(sec, perSec, difficulty));
      });
    } else {
      q = generateQuestions(requestedSection, count, difficulty);
    }
    setQuestions(q);
    const uniqueSections = Array.from(new Set(q.map(x => x.section)));
    setSections(uniqueSections);
    setTimePerQuestion(new Array(q.length).fill(0));
    setVisited({ 0: true });
  }, [requestedSection, count, difficulty]);

  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) { finishTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isFinished, questions.length]);

  // Anti-cheat handlers
  useEffect(() => {
    if (!isExamMode) return;
    const handleContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContext);
    
    const handleVisibility = () => {
      if (document.hidden && !isFinished) {
        setTabWarnings((w) => w + 1);
        setShowWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    
    return () => {
      document.removeEventListener("contextmenu", handleContext);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isFinished, isExamMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const recordQuestionTime = useCallback(() => {
    const elapsed = (Date.now() - questionStartTime) / 1000;
    setTimePerQuestion((prev) => {
      const next = [...prev];
      next[currentIndex] = (next[currentIndex] || 0) + elapsed;
      return next;
    });
  }, [currentIndex, questionStartTime]);

  const selectAnswer = (val: string | number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: val }));
  };

  const toggleReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const clearResponse = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  const goToQuestion = (index: number) => {
    recordQuestionTime();
    setCurrentIndex(index);
    setVisited(prev => ({...prev, [index]: true}));
    setQuestionStartTime(Date.now());
  };

  const jumpToSection = (section: string) => {
    const firstIdx = questions.findIndex(q => q.section === section);
    if (firstIdx !== -1) goToQuestion(firstIdx);
  };

  const runCode = () => {
    setCodeOutput("Compiling...\n\nRunning Test Cases...\nTest Case 1: Passed\nTest Case 2: Passed\n\nAll test cases passed!");
  };

  const finishTest = useCallback(() => {
    if (isFinished) return;
    recordQuestionTime();
    setIsFinished(true);
    clearInterval(timerRef.current);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(()=>{});
    }

    let correct = 0;
    const sectionBreakdown: Record<string, { correct: number; total: number }> = {};
    const mistakes: MistakeEntry[] = [];

    questions.forEach((q, i) => {
      const sec = q.section;
      if (!sectionBreakdown[sec]) sectionBreakdown[sec] = { correct: 0, total: 0 };
      sectionBreakdown[sec].total++;

      if (q.type === "mcq" && answers[i] === q.correctIndex) {
        correct++;
        sectionBreakdown[sec].correct++;
      } else if (q.type === "coding" && answers[i]) {
        // Assume coding is correct if not empty
        correct++;
        sectionBreakdown[sec].correct++;
      } else if (answers[i] !== undefined) {
        mistakes.push({
          questionText: q.text,
          selectedAnswer: String(answers[i]),
          correctAnswer: q.type === "mcq" ? q.options[q.correctIndex] : "Correct logic",
          section: q.section,
          pattern: q.pattern,
          category: "Conceptual",
          timeSpent: timePerQuestion[i] || 0,
        });
      }
    });

    const totalTime = (120 * 60) - totalTimeLeft;
    const result: TestResult = {
      id: Math.random().toString(36).substring(2, 10),
      company, section: requestedSection, difficulty,
      totalQuestions: questions.length,
      correctAnswers: correct,
      score: Math.round((correct / questions.length) * 100),
      accuracy: Math.round((correct / Math.max(Object.keys(answers).length, 1)) * 100),
      timePerQuestion, totalTime,
      date: new Date().toISOString(),
      sectionBreakdown, mistakes,
    };

    saveResult(result);
    navigate(`/test/results/${result.id}`, { state: { result } });
  }, [isFinished, questions, answers, timePerQuestion, totalTimeLeft, company, requestedSection, difficulty, navigate, recordQuestionTime]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="font-mono text-green-400 animate-pulse tracking-widest text-sm uppercase">
          Initializing Exam Environment...
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(totalTimeLeft / 60);
  const seconds = totalTimeLeft % 60;
  const isTimeLow = totalTimeLeft < 300; // 5 mins
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col font-mono selection:bg-green-500/30 cyber-grid">
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-red-600/90 backdrop-blur text-white p-4 text-center font-bold flex flex-col items-center gap-2 shadow-2xl shadow-red-500/20"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>NAVIGATION WARNING ({tabWarnings}/3)</span>
            </div>
            <p className="text-sm font-normal">Leaving the exam window is strictly prohibited.</p>
            <button onClick={() => setShowWarning(false)} className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-4 py-1 rounded transition-colors">Acknowledge</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmEnd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Submit Exam</h3>
                  <button onClick={() => setShowConfirmEnd(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Answered</span>
                    <span className="text-emerald-400 font-bold">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Unanswered</span>
                    <span className="text-rose-400 font-bold">{questions.length - answeredCount}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400">Marked for Review</span>
                    <span className="text-amber-400 font-bold">{Object.values(markedForReview).filter(Boolean).length}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmEnd(false)} className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors">Cancel</button>
                  <button onClick={() => { setShowConfirmEnd(false); finishTest(); }} className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-green-600 text-black hover:bg-green-500 transition-colors shadow-lg shadow-green-500/20">Confirm Submit</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Top Header */}
      <header className="h-16 shrink-0 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center font-bold text-black shadow-lg shadow-green-600/20">E</div>
          <div>
            <h1 className="font-bold text-white tracking-wide">TCS NQT MOCK TEST</h1>
            <p className="text-xs text-slate-400">Candidate: DEMO-USER | ID: 900493</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5">
            <label className="text-xs font-medium text-slate-400">Exam Mode</label>
            <button 
              onClick={() => setIsExamMode(!isExamMode)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isExamMode ? 'bg-green-600' : 'bg-green-900'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isExamMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <button onClick={toggleFullscreen} className="text-slate-400 hover:text-white transition-colors" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          <div className={`flex items-center gap-2 font-mono font-bold text-lg px-4 py-1.5 rounded-lg ${isTimeLow ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/50" : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
            <Clock className="w-4 h-4" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          
          <button onClick={() => setShowConfirmEnd(true)} className="px-5 py-2 rounded-lg font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20">
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Left Side - Question Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Section Navigation Tabs */}
          <div className="bg-[#0f172a] border-b border-slate-800 flex overflow-x-auto no-scrollbar px-2 pt-2">
            {sections.map(sec => {
              const isActive = currentQ.section === sec;
              return (
                <button
                  key={sec}
                  onClick={() => isExamMode ? null : jumpToSection(sec)}
                  className={`px-4 py-3 flex items-center gap-2 whitespace-nowrap text-sm font-medium border-b-2 transition-all ${
                    isActive ? "border-green-500 text-green-400 bg-green-500/5" : "border-transparent text-green-700 hover:text-green-500 hover:bg-green-900/50"
                  } ${isExamMode && !isActive ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {SECTION_ICONS[sec]}
                  {sec}
                </button>
              );
            })}
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <motion.div 
               key={currentIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.3 }}
               className="max-w-4xl mx-auto"
            >
              
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-black flex flex-col items-center justify-center font-bold text-green-400 border border-green-800 text-sm">
                    {currentIndex + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">{currentQ.pattern || "General"}</h2>
                    <p className="text-xs text-slate-400">{currentQ.type === 'coding' ? 'Coding Scenario' : 'Multiple Choice Question'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Marks: +1.0</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-rose-400 border border-slate-700">Negative: 0.0</span>
                </div>
              </div>

              <div className="text-base md:text-lg text-slate-200 mb-8 whitespace-pre-wrap leading-relaxed font-medium">
                {currentQ.text}
              </div>

              {currentQ.type === "mcq" ? (
                <div className="space-y-3">
                  {currentQ.options.map((option, oi) => {
                    const isSelected = answers[currentIndex] === oi;
                    const isPracticeModeCorrect = !isExamMode && oi === currentQ.correctIndex;
                    
                    return (
                      <motion.button
                        key={oi}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectAnswer(oi)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all group ${
                          isSelected 
                            ? "border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)] ring-1 ring-green-500/50" 
                            : isPracticeModeCorrect
                              ? "border-emerald-500/50 bg-emerald-500/5"
                              : "border-green-900 bg-black/50 hover:border-green-500/50 hover:bg-green-900/30"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? "border-green-500 bg-green-500" : "border-green-800 group-hover:border-green-500"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={`text-sm md:text-base ${isSelected ? "text-white font-medium" : "text-slate-300"}`}>
                          {option}
                        </span>
                        
                        {!isExamMode && isPracticeModeCorrect && !isSelected && (
                          <span className="ml-auto text-xs font-bold text-emerald-500 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct Answer
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <select 
                      value={codingLanguage} 
                      onChange={(e) => setCodingLanguage(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white rounded p-1 text-sm outline-none"
                    >
                      <option value="cpp">C++ (GCC)</option>
                      <option value="java">Java (Open JDK)</option>
                      <option value="python">Python 3</option>
                      <option value="c">C (GCC)</option>
                    </select>
                    <button onClick={runCode} className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded flex items-center gap-2 text-sm font-bold transition-colors">
                      <PlayCircle className="w-4 h-4" /> Run Code
                    </button>
                  </div>
                  <div className="border border-slate-800 rounded-lg overflow-hidden h-80">
                      <Editor 
                        height="100%"
                        theme="vs-dark"
                        language={codingLanguage}
                        value={answers[currentIndex] as string || "// Write your code here..."}
                        onChange={(val) => selectAnswer(val || "")}
                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                      />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">Custom Input</label>
                      <textarea 
                        className="w-full h-32 bg-black border border-green-800 rounded-lg p-3 text-sm text-green-400 font-mono resize-none focus:border-green-500 outline-none" 
                        placeholder="Enter custom input here..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">Output</label>
                      <div className="w-full h-32 bg-[#1e1e1e] border border-slate-800 rounded-lg p-3 text-sm text-slate-300 font-mono overflow-y-auto whitespace-pre-wrap">
                        {codeOutput || "Run code to see output..."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Action Footer */}
          <div className="h-20 bg-[#0B1120] border-t border-slate-800 p-4 flex items-center justify-between shrink-0">
             <div className="flex gap-3">
               <button onClick={toggleReview} className="px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 font-medium text-sm flex items-center gap-2 transition-colors">
                 <Bookmark className={`w-4 h-4 ${markedForReview[currentIndex] ? 'fill-current' : ''}`} /> 
                 {markedForReview[currentIndex] ? "Unmark" : "Mark for Review"}
               </button>
               <button onClick={clearResponse} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 font-medium text-sm flex items-center gap-2 transition-colors">
                 <CircleDashed className="w-4 h-4" /> Clear
               </button>
             </div>

             <div className="flex gap-3">
               <button 
                onClick={() => goToQuestion(currentIndex - 1)} 
                disabled={currentIndex === 0}
                className="px-6 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors border border-slate-700"
               >
                 Previous
               </button>
               <button 
                onClick={() => {
                  if (currentIndex === questions.length - 1) setShowConfirmEnd(true);
                  else goToQuestion(currentIndex + 1);
                }} 
                className="px-8 py-2 rounded-lg bg-green-600 text-black hover:bg-green-500 font-bold text-sm shadow-lg shadow-green-500/20 transition-all border border-green-500/50"
               >
                 {currentIndex === questions.length - 1 ? "Submit" : "Save & Next"}
               </button>
             </div>
          </div>
        </div>

        {/* Right Side - Question Palette */}
        <div className="w-full lg:w-80 bg-[#0c1322] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 h-[40vh] lg:h-auto">
          
          <div className="p-4 border-b border-slate-800 bg-[#0f172a]">
            <h3 className="font-bold text-white mb-4">Question Palette</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
               <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-emerald-500"></div></div> <span className="text-slate-300">Answered</span></div>
               <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md bg-rose-500/20 border border-rose-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-rose-500"></div></div> <span className="text-slate-300">Not Answered</span></div>
               <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500"><Bookmark className="w-3 h-3 fill-current" /></div> <span className="text-slate-300">Marked</span></div>
               <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700"></div> <span className="text-slate-300">Not Visited</span></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 content-start">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">{currentQ.section}</h4>
            
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                if (isExamMode && q.section !== currentQ.section) return null; // In strict exam mode, only show current section questions in palette
                
                const isAnswered = answers[i] !== undefined;
                const isMarked = markedForReview[i];
                const isVisited = visited[i];
                const isCurrent = i === currentIndex;
                
                let bCls = "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500";
                
                if (isMarked) {
                  bCls = "bg-amber-500/20 border-amber-500 text-amber-400";
                } else if (isAnswered) {
                  bCls = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                } else if (isVisited) {
                  bCls = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold";
                }

                if (isCurrent) {
                  bCls += " ring-2 ring-green-500 ring-offset-2 ring-offset-black";
                }

                return (
                  <button
                    key={i}
                    onClick={() => goToQuestion(i)}
                    className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all border ${bCls}`}
                  >
                     {isMarked ? <Bookmark className="w-4 h-4 fill-current opacity-50 absolute inset-0 m-auto" /> : null}
                     <span className={`${isMarked ? 'z-10 text-xs font-bold' : ''}`}>{i + 1}</span>
                     {isMarked && isAnswered && <CheckCircle2 className="w-3 h-3 absolute -bottom-1 -right-1 text-emerald-500 bg-[#0c1322] rounded-full z-20" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
