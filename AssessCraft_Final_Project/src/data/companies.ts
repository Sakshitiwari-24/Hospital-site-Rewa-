// Company data and exam structure information

export interface Company {
  id: string;
  name: string;
  shortName: string;
  color: string;
  examStructure: string;
  sections: string[];
  duration: string;
  totalQuestions: number;
  description: string;
}

export const companies: Company[] = [
  {
    id: "tcs",
    name: "TCS (NQT / Digital / Prime)",
    shortName: "TCS",
    color: "173 80% 40%",
    examStructure: "NQT: Numerical, Verbal, Reasoning, Programming. Digital: Advanced aptitude + Coding. Prime: Higher difficulty with sectional cutoffs.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Pseudo Code"],
    duration: "120 min",
    totalQuestions: 80,
    description: "India's largest IT services company. NQT is the gateway exam for freshers."
  },
  {
    id: "infosys",
    name: "Infosys",
    shortName: "Infosys",
    color: "210 100% 45%",
    examStructure: "InfyTQ: Aptitude + Coding. SP exam: Quantitative, Logical, Verbal with moderate difficulty.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Pseudo Code"],
    duration: "90 min",
    totalQuestions: 65,
    description: "Leading IT company known for InfyTQ and SP hiring exams."
  },
  {
    id: "cognizant",
    name: "Cognizant",
    shortName: "CTS",
    color: "260 60% 50%",
    examStructure: "GenC: Basic aptitude. GenC Next: Advanced aptitude + coding. GenC Elevate: Highest difficulty.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Data Interpretation", "Verbal Ability"],
    duration: "90 min",
    totalQuestions: 60,
    description: "Major IT company with GenC tier-based hiring."
  },
  {
    id: "salesforce",
    name: "Salesforce",
    shortName: "SF",
    color: "200 90% 50%",
    examStructure: "Online assessment with aptitude, coding, and system design questions. High difficulty level.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Pseudo Code", "Data Interpretation"],
    duration: "90 min",
    totalQuestions: 50,
    description: "Premium CRM company with challenging technical assessments."
  },
  {
    id: "wipro",
    name: "Wipro",
    shortName: "Wipro",
    color: "45 90% 50%",
    examStructure: "NLTH: Aptitude + Written Communication + Coding. Elite/Turbo: Higher difficulty tiers.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Pseudo Code"],
    duration: "100 min",
    totalQuestions: 70,
    description: "Top IT services company with NLTH tiered hiring program."
  },
  {
    id: "accenture",
    name: "Accenture",
    shortName: "ACC",
    color: "280 70% 55%",
    examStructure: "Cognitive & Technical Assessment: English, Critical Reasoning, Abstract Reasoning, Common Application & MS Office.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"],
    duration: "90 min",
    totalQuestions: 90,
    description: "Global consulting and IT services giant."
  },
  {
    id: "capgemini",
    name: "Capgemini",
    shortName: "Cap",
    color: "15 80% 50%",
    examStructure: "Game-based aptitude + Technical MCQs + Coding. Behavioral assessment included.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Pseudo Code"],
    duration: "80 min",
    totalQuestions: 55,
    description: "French IT giant with gamified assessment approach."
  },
  {
    id: "generic",
    name: "Generic IT Pattern",
    shortName: "GEN",
    color: "150 60% 45%",
    examStructure: "Standard IT company exam pattern: Aptitude + Verbal + Logical + Programming Logic.",
    sections: ["Quantitative Aptitude", "Logical Reasoning", "Data Interpretation", "Verbal Ability", "Pseudo Code"],
    duration: "90 min",
    totalQuestions: 60,
    description: "Practice with a general IT assessment pattern applicable across companies."
  },
];

export const sectionIcons: Record<string, string> = {
  "Quantitative Aptitude": "📐",
  "Logical Reasoning": "🧩",
  "Data Interpretation": "📊",
  "Verbal Ability": "📝",
  "Pseudo Code": "💻",
  "Programming Logic": "💻",
};

export const difficultyLevels = ["Easy", "Medium", "Hard"] as const;
export type DifficultyLevel = typeof difficultyLevels[number];

export const questionCounts = [5, 10, 20, 30] as const;
