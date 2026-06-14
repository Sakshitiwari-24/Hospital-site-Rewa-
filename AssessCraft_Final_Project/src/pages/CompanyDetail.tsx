import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { companies, sectionIcons } from "@/data/companies";
import { getCompanyReadiness, getCompanyResults } from "@/lib/testStorage";
import { Clock, FileText, Play } from "lucide-react";
import Navbar from "@/components/Navbar";

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === companyId);

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono text-muted-foreground">Module not found.</p>
      </div>
    );
  }

  const readiness = getCompanyReadiness(company.id);
  const results = getCompanyResults(company.id);

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Navbar showBack title={company.shortName} />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase border border-primary/30 px-3 py-1">
            {company.shortName}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mt-6 mb-2">{company.name}</h1>
          <p className="font-mono text-sm text-muted-foreground mb-10">{company.description}</p>

          {/* Exam Structure */}
          <div className="border border-border bg-card p-6 mb-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <FileText className="h-3 w-3" /> Exam Structure
            </h2>
            <p className="font-mono text-sm text-muted-foreground mb-4">{company.examStructure}</p>
            <div className="flex flex-wrap gap-6 font-mono text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-foreground">{company.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-primary" />
                <span className="text-foreground">{company.totalQuestions} questions</span>
              </div>
            </div>
          </div>

          {/* Readiness */}
          {readiness > 0 && (
            <div className="border border-primary/30 bg-accent/20 p-6 mb-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Readiness Index</h2>
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 border-2 border-primary flex items-center justify-center glow-primary">
                  <span className="font-mono font-bold text-xl text-primary">{readiness}%</span>
                </div>
                <div className="font-mono text-sm">
                  <p className="text-muted-foreground">{results.length} tests completed</p>
                  <p className="text-muted-foreground">
                    Last: {results[0]?.date ? new Date(results[0].date).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Available Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border mb-8">
            {company.sections.map((section) => (
              <button
                key={section}
                onClick={() => navigate(`/test/configure?company=${company.id}&section=${encodeURIComponent(section)}`)}
                className="flex items-center gap-3 bg-card p-4 hover:bg-accent/20 transition-all text-left group"
              >
                <span className="text-xl">{sectionIcons[section] || "📄"}</span>
                <div className="flex-1">
                  <p className="font-mono font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {section}
                  </p>
                </div>
                <Play className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate(`/test/configure?company=${company.id}`)}
            className="w-full border-2 border-primary bg-primary/10 px-6 py-4 font-mono font-bold text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all glow-primary"
          >
            Initialize Full Mock Test
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDetail;
