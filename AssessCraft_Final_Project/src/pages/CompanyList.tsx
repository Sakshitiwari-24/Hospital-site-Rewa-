import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { companies } from "@/data/companies";
import { getCompanyReadiness } from "@/lib/testStorage";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const CompanyList = () => {
  return (
    <div className="min-h-screen bg-background noise-bg">
      <Navbar showBack title="All Modules" />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="border border-border bg-border">
          {companies.map((c, i) => {
            const readiness = getCompanyReadiness(c.id);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/company/${c.id}`}
                  className="flex items-center gap-4 bg-card p-5 hover:bg-accent/20 transition-all group border-b border-border last:border-b-0"
                >
                  <div className="h-10 w-10 border border-primary/30 flex items-center justify-center">
                    <span className="font-mono font-bold text-primary text-xs">{c.shortName}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors text-sm">{c.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {readiness > 0 && (
                      <span className="font-mono font-bold text-primary text-sm">{readiness}%</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
