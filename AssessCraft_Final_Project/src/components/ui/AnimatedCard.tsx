import { motion } from "framer-motion";
import { ReactNode } from "react";

export const AnimatedCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-xl surface-glass border border-border shadow-lg hover:shadow-green-500/20 hover:border-green-500/50 transition-all ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 pointer-events-none" />
      {children}
    </motion.div>
  );
};
