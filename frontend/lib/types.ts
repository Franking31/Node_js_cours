export type QuestionType = "qcm" | "vf" | "ouvert";

export type Level = "licence1" | "licence2" | "licence3" | "master1" | "master2";

export type UserRole = "STUDENT" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/* ── Question affichée pendant le quiz (SANS réponse correcte) ── */
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  order: number;
}

/* ── Réponse collectée côté client ── */
export interface SubmitAnswer {
  questionId: string;
  userAnswer: string;
}

/* ── Résultat renvoyé par le backend après soumission ── */
export interface QuizResult {
  questionId: string;
  question: string;
  type: QuestionType;
  options?: string[];
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

export interface SubmitResponse {
  score: number;
  total: number;
  percentage: number;
  results: QuizResult[];
}

export interface QuizConfig {
  title: string;
  content: string;
  subject: string;
  level: Level;
  questionCount: number;
  selectedTypes: QuestionType[];
}

/* ── Historique ── */
export interface QuizHistoryItem {
  id: string;
  createdAt: string;
  questionCount: number;
  types: QuestionType[];
  status: string;
  course: {
    title: string;
    subject: string;
    level: Level;
  };
  questions: {
    id: string;
    type: QuestionType;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    order: number;
  }[];
}