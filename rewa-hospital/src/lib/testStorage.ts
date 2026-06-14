// Test results and history storage (localStorage for now, will migrate to Supabase)

export interface TestResult {
  id: string;
  company: string;
  section: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number;
  timePerQuestion: number[];
  totalTime: number;
  date: string;
  sectionBreakdown: Record<string, { correct: number; total: number }>;
  mistakes: MistakeEntry[];
}

export interface MistakeEntry {
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  section: string;
  pattern: string;
  category: "Conceptual" | "Calculation" | "Time Pressure";
  timeSpent: number;
}

const RESULTS_KEY = "assesscraft_results";

export function saveResult(result: TestResult): void {
  const existing = getResults();
  existing.unshift(result);
  // Keep last 100 results
  localStorage.setItem(RESULTS_KEY, JSON.stringify(existing.slice(0, 100)));
}

export function getResults(): TestResult[] {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getCompanyResults(company: string): TestResult[] {
  return getResults().filter(r => r.company === company);
}

export function getRecentResults(count: number = 10): TestResult[] {
  return getResults().slice(0, count);
}

export function getMistakes(): MistakeEntry[] {
  return getResults().flatMap(r => r.mistakes);
}

export function getCompanyReadiness(company: string): number {
  const results = getCompanyResults(company);
  if (results.length === 0) return 0;
  const recent = results.slice(0, 5);
  const avgAccuracy = recent.reduce((s, r) => s + r.accuracy, 0) / recent.length;
  return Math.round(avgAccuracy);
}
