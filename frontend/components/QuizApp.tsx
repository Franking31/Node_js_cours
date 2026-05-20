"use client";
import { useState } from "react";
import { Question, QuizConfig, AnswerRecord } from "@/lib/types";
import { generateQuiz } from "@/lib/generateQuiz";
import UploadPhase from "./UploadPhase";
import LoadingPhase from "./LoadingPhase";
import QuizPhase from "./QuizPhase";
import ResultsPhase from "./ResultsPhase";
import styles from "../modules/QuizApp.module.css";

type Phase = "upload" | "loading" | "quiz" | "results";

export default function QuizApp() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [retryList, setRetryList] = useState<Question[]>([]);

  async function handleGenerate(config: QuizConfig) {
    setPhase("loading");
    try {
      const qs = await generateQuiz(config);
      setQuestions(qs);
      setAnswers([]);
      setPhase("quiz");
    } catch (e) {
      console.error(e);
      alert("Erreur de génération. Vérifie que ton cours contient suffisamment de contenu.");
      setPhase("upload");
    }
  }

  function handleQuizFinish(records: AnswerRecord[]) {
    setAnswers(records);
    setPhase("results");
  }

  function handleRetryWrong() {
    const wrong = questions.filter((_, i) =>
      answers.find((a) => a.questionIndex === i && !a.isCorrect)
    );
    if (wrong.length === 0) return;
    setRetryList(wrong);
    setQuestions(wrong);
    setAnswers([]);
    setPhase("quiz");
  }

  function handleRestart() {
    setQuestions([]);
    setAnswers([]);
    setRetryList([]);
    setPhase("upload");
  }

  const stepIndex = { upload: 0, loading: 1, quiz: 2, results: 2 }[phase];

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <i className="ti ti-brain" aria-hidden="true" />
        </div>
        <div>
          <h1>QuizAI</h1>
          <p>Générateur de quiz intelligent basé sur ton cours</p>
        </div>
      </header>

      <div className={styles.steps}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles.step} ${i < stepIndex ? styles.done : i === stepIndex ? styles.active : ""}`}
          />
        ))}
      </div>

      {phase === "upload" && <UploadPhase onGenerate={handleGenerate} />}
      {phase === "loading" && <LoadingPhase />}
      {phase === "quiz" && (
        <QuizPhase questions={questions} onFinish={handleQuizFinish} />
      )}
      {phase === "results" && (
        <ResultsPhase
          questions={questions}
          answers={answers}
          onRestart={handleRestart}
          onRetryWrong={handleRetryWrong}
        />
      )}
    </div>
  );
}