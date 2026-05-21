export type QuestionType = "qcm" | "vf" | "ouvert";

export type Level = "licence1" | "licence2" | "licence3" | "master1" | "master2";

export interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface QuizConfig {
  title: string;            // ← titre du cours
  content: string;          // ← contenu brut (était courseText)
  subject: string;
  level: Level;
  questionCount: number;
  selectedTypes: QuestionType[];
}

export interface AnswerRecord {
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
}