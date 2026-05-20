export type QuestionType = "qcm" | "vf" | "ouvert";

export interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface QuizConfig {
  title: string;       // ← ajouter
  content: string;
  courseText: string;
  subject: string;
  level: string;
  questionCount: number;
  selectedTypes: QuestionType[];
}

export interface AnswerRecord {
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
}