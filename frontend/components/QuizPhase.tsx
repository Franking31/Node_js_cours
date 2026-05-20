"use client";
import { useState } from "react";
import { Question, AnswerRecord } from "@/lib/types";
import styles from "../modules/QuizPhase.module.css";

interface Props {
  questions: Question[];
  onFinish: (answers: AnswerRecord[]) => void;
}

const LETTERS = ["A", "B", "C", "D"];

export default function QuizPhase({ questions, onFinish }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [openText, setOpenText] = useState("");
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);

  const q = questions[currentQ];
  const total = questions.length;
  const progress = Math.round(((currentQ + 1) / total) * 100);

  const typeLabel = q.type === "qcm" ? "QCM" : q.type === "vf" ? "Vrai / Faux" : "Question ouverte";
  const typeIcon = q.type === "ouvert" ? "ti-pencil" : q.type === "vf" ? "ti-toggle-left" : "ti-list-check";
  const typeStyle = q.type === "qcm" ? styles.tagQcm : q.type === "vf" ? styles.tagVf : styles.tagOuvert;

  function checkCorrect(userAnswer: string): boolean {
    if (q.type === "ouvert") return true;
    return userAnswer.trim().toUpperCase().startsWith(q.answer.trim().toUpperCase());
  }

  function validate() {
    const userAnswer = q.type === "ouvert" ? openText : selected ?? "";
    if (!userAnswer) return;
    const isCorrect = checkCorrect(userAnswer);
    if (isCorrect) setScore((s) => s + 1);
    setRecords((r) => [...r, { questionIndex: currentQ, userAnswer, isCorrect }]);
    setValidated(true);
  }

  function next() {
    if (currentQ + 1 >= total) {
      onFinish([...records]);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setOpenText("");
      setValidated(false);
    }
  }

  const currentRecord = records[records.length - 1];
  const isCorrect = validated && currentRecord?.isCorrect;

  return (
    <div className={styles.container}>
      <div className={styles.quizHeader}>
        <div>
          <p className={styles.phase}>Quiz en cours</p>
          <span className={styles.counter}>Question {currentQ + 1}/{total}</span>
        </div>
        <span className={styles.scoreBadge}>{score} pts</span>
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
            disabled={validated}
          />
        ) : (
          <div className={styles.options}>
            {q.options?.map((opt, i) => {
              const letter = LETTERS[i];
              const isSelected = selected === letter;
              const isAnswerCorrect = letter === q.answer.trim().toUpperCase();
              let optClass = styles.option;
              if (validated) {
                if (isAnswerCorrect) optClass += ` ${styles.correct}`;
                else if (isSelected && !isAnswerCorrect) optClass += ` ${styles.wrong}`;
              } else if (isSelected) {
                optClass += ` ${styles.selected}`;
              }

              return (
                <div
                  key={i}
                  className={optClass}
                  onClick={() => { if (!validated) setSelected(letter); }}
                >
                  <span className={styles.optLetter}>{letter}</span>
                  {opt.replace(/^[A-D]\.\s*/, "")}
                </div>
              );
            })}
          </div>
        )}

        {validated && (
          <div className={`${styles.feedback} ${isCorrect ? styles.feedbackOk : styles.feedbackKo}`}>
            <i className={`ti ${isCorrect ? "ti-circle-check" : "ti-circle-x"}`} aria-hidden="true" />
            {q.type === "ouvert"
              ? `Éléments de réponse : ${q.answer}`
              : isCorrect
              ? `Correct ! ${q.explanation}`
              : `Incorrect. ${q.explanation}`}
          </div>
        )}
      </div>

      <div className={styles.btnRow}>
        {!validated ? (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={validate}
            disabled={q.type !== "ouvert" ? !selected : !openText.trim()}
          >
            <i className="ti ti-check" aria-hidden="true" /> Valider
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={next}>
            {currentQ + 1 >= total ? "Voir les résultats" : "Question suivante"}
            <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}