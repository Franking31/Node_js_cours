"use client";
import { useState } from "react";
import { QuizQuestion, SubmitAnswer } from "@/lib/types";
import styles from "../modules/QuizPhase.module.css";

interface Props {
  questions: QuizQuestion[];
  onFinish: (answers: SubmitAnswer[]) => void;
}

const LETTERS = ["A", "B", "C", "D"];

export default function QuizPhase({ questions, onFinish }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [openText, setOpenText] = useState("");
  const [answers, setAnswers] = useState<SubmitAnswer[]>([]);

  const q = questions[currentQ];
  const total = questions.length;
  const progress = Math.round(((currentQ + 1) / total) * 100);

  const typeLabel = q.type === "qcm" ? "QCM" : q.type === "vf" ? "Vrai / Faux" : "Question ouverte";
  const typeIcon = q.type === "ouvert" ? "ti-pencil" : q.type === "vf" ? "ti-toggle-left" : "ti-list-check";
  const typeStyle = q.type === "qcm" ? styles.tagQcm : q.type === "vf" ? styles.tagVf : styles.tagOuvert;

  const userAnswer = q.type === "ouvert" ? openText : selected ?? "";
  const canNext = userAnswer.trim().length > 0;

  function handleNext() {
    if (!canNext) return;

    const newAnswers = [
      ...answers,
      { questionId: q.id, userAnswer: userAnswer.trim() },
    ];
    setAnswers(newAnswers);

    if (currentQ + 1 >= total) {
      onFinish(newAnswers);
    } else {
      setCurrentQ((i) => i + 1);
      setSelected(null);
      setOpenText("");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        <div>
          <p className={styles.phase}>Quiz en cours</p>
          <span className={styles.counter}>Question {currentQ + 1}/{total}</span>
        </div>
        <span className={styles.scoreBadge}>{currentQ}/{total} répondues</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.card}>
        <span className={`${styles.typeTag} ${typeStyle}`}>
          <i className={`ti ${typeIcon}`} aria-hidden="true" />
          {typeLabel}
        </span>
        <p className={styles.qText}>{q.question}</p>

        {q.type === "ouvert" ? (
          <textarea
            className={styles.openAnswer}
            value={openText}
            onChange={(e) => setOpenText(e.target.value)}
            placeholder="Écris ta réponse ici…"
            rows={3}
          />
        ) : (
          <div className={styles.options}>
            {q.options?.map((opt, i) => {
              const letter = LETTERS[i];
              const isSelected = selected === letter;
              return (
                <div
                  key={i}
                  className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                  onClick={() => setSelected(letter)}
                >
                  <span className={styles.optLetter}>{letter}</span>
                  {opt.replace(/^[A-D]\.\s*/, "")}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.btnRow}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleNext}
          disabled={!canNext}
        >
          {currentQ + 1 >= total ? (
            <><i className="ti ti-send" aria-hidden="true" /> Soumettre le quiz</>
          ) : (
            <>Question suivante <i className="ti ti-arrow-right" aria-hidden="true" /></>
          )}
        </button>
      </div>
    </div>
  );
}