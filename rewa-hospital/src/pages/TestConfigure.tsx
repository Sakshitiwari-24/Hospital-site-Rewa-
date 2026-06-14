import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { companies, sectionIcons, difficultyLevels, questionCounts } from "@/data/companies";
import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";

const TestConfigure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedCompany = searchParams.get("company") || "";
  const preselectedSection = searchParams.get("section") || "";

  const [selectedCompany, setSelectedCompany] = useState(preselectedCompany);
  const [selectedSection, setSelectedSection] = useState(preselectedSection);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>("Medium");

  const company = companies.find((c) => c.id === selectedCompany);
  const availableSections = company?.sections || [];

  const canStart = selectedCompany && selectedSection && questionCount && difficulty;

  const handleStart = () => {
    if (!canStart) return;
    const params = new URLSearchParams({
      company: selectedCompany,
      section: selectedSection,
      count: String(questionCount),
      difficulty,
    });
    navigate(`/test/exam?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Navbar showBack title="Configure Test" />

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          {/* Company Selection */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{'>'} Select Target</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCompany(c.id);
                    if (!c.sections.includes(selectedSection)) setSelectedSection("");
                  }}
                  className={`p-3 text-center font-mono text-xs font-bold transition-all ${selectedCompany === c.id
                      ? "bg-primary/10 text-primary border-glow"
                      : "bg-card text-foreground hover:bg-accent/20"
                    }`}
                >
                  {c.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          {selectedCompany && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{'>'} Select Section</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
                {availableSections.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSection(s)}
                    className={`p-3 text-left font-mono text-xs transition-all flex items-center gap-2 ${selectedSection === s
                        ? "bg-primary/10 text-primary border-glow"
                        : "bg-card text-foreground hover:bg-accent/20"
                      }`}
                  >
                    <span>{sectionIcons[s] || "📄"}</span>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question Count */}
          {selectedSection && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{'>'} Question Count</label>
              <div className="flex gap-px bg-border border border-border">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 p-3 text-center font-mono text-sm font-bold transition-all ${questionCount === count
                        ? "bg-primary/10 text-primary border-glow"
                        : "bg-card text-foreground hover:bg-accent/20"
                      }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Difficulty */}
          {selectedSection && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{'>'} Difficulty Level</label>
              <div className="flex gap-px bg-border border border-border">
                {difficultyLevels.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 p-3 text-center font-mono text-xs font-bold uppercase tracking-wider transition-all ${difficulty === d
                        ? "bg-primary/10 text-primary border-glow"
                        : "bg-card text-foreground hover:bg-accent/20"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          {canStart && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={handleStart}
                className="w-full flex items-center justify-center gap-3 border-2 border-primary bg-primary/10 px-6 py-5 font-mono font-bold text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all glow-primary-strong"
              >
                <Play className="h-4 w-4" />
                Execute — {questionCount} Questions • {difficulty}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TestConfigure;
