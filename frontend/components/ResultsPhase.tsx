"use client";
import { Question, AnswerRecord } from "@/lib/types";
import styles from "../modules/ResultsPhase.module.css";

interface Props {
  questions: Question[];
  answers: AnswerRecord[];
  onRestart: () => void;
  onRetryWrong: () => void;
}

export default function ResultsPhase({ questions, answers, onRestart, onRetryWrong }: Props) {
  const total = questions.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  const title = pct >= 80 ? "Excellent ! 🎯" : pct >= 60 ? "Bien joué !" : "Encore un effort !";
  const msg =
    pct >= 80
      ? "Tu maîtrises très bien ce cours."
      : pct >= 60
      ? "Quelques points à revoir."
      : "Reprends tes notes et réessaie.";

  const wrongCount = answers.filter((a) => !a.isCorrect).length;

  return (
    <div className={styles.container}>
      <p className={styles.phase}>Résultats finaux</p>

      <div className={styles.hero}>
        <div className={styles.ring}>
          <span className={styles.num}>{correct}</span>
          <span className={styles.den}>/{total}</span>
        </div>
        <h2>{title}</h2>
        <p>{msg}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.val} style={{ color: "var(--success)" }}>{correct}</div>
          <div className={styles.lbl}>Correctes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.val} style={{ color: "var(--danger)" }}>{wrong}</div>
          <div className={styles.lbl}>Incorrectes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.val}>{pct}%</div>
          <div className={styles.lbl}>Réussite</div>
        </div>
      </div>

      <div className={styles.divider} />
      <p className={styles.phase}>Révision rapide</p>

      <div className={styles.reviewList}>
        {questions.map((q, i) => {
          const record = answers.find((a) => a.questionIndex === i);
          const ok = record?.isCorrect ?? false;
          return (
            <div key={i} className={`${styles.reviewItem} ${ok ? styles.reviewOk : styles.reviewKo}`}>
              <i className={`ti ${ok ? "ti-circle-check" : "ti-circle-x"}`} aria-hidden="true" />
              <div>
                <p className={styles.reviewQ}>{q.question}</p>
                {!ok && <p className={styles.reviewAns}>Bonne réponse : {q.answer}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btn} onClick={onRestart}>
          <i className="ti ti-refresh" aria-hidden="true" /> Nouveau quiz
        </button>
        {wrongCount > 0 && (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onRetryWrong}>
            <i className="ti ti-repeat" aria-hidden="true" /> Refaire les erreurs ({wrongCount})
          </button>
        )}
      </div>
    </div>
  );
}