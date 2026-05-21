"use client";
import { SubmitResponse, QuizResult } from "@/lib/types";
import styles from "../modules/ResultsPhase.module.css";

interface Props {
  response: SubmitResponse;
  onRestart: () => void;
  onRetryWrong: (wrongIds: string[]) => void;
}

const LETTERS = ["A", "B", "C", "D"];

export default function ResultsPhase({ response, onRestart, onRetryWrong }: Props) {
  const results: QuizResult[] = response?.results ?? [];
  const score = Math.round(response?.score ?? 0);
  const total = Math.round(response?.total ?? results.length);
  const percentage = Math.round(response?.percentage ?? 0);
  const wrongResults = results.filter((r) => !r.isCorrect);  // ← ligne manquante

  const title = percentage >= 80 ? "Excellent ! 🎯" : percentage >= 60 ? "Bien joué !" : "Encore un effort !";
  const msg =
    percentage >= 80
      ? "Tu maîtrises très bien ce cours."
      : percentage >= 60
      ? "Quelques points à revoir."
      : "Reprends tes notes et réessaie.";

  return (
    <div className={styles.container}>
      <p className={styles.phase}>Résultats finaux</p>

      <div className={styles.hero}>
        <div className={styles.ring}>
          <span className={styles.num}>{score}</span>
          <span className={styles.den}>/{total}</span>
        </div>
        <h2>{title}</h2>
        <p>{msg}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.val} style={{ color: "var(--success)" }}>{score}</div>
          <div className={styles.lbl}>Correctes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.val} style={{ color: "var(--danger)" }}>{total - score}</div>
          <div className={styles.lbl}>Incorrectes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.val}>{percentage}%</div>
          <div className={styles.lbl}>Réussite</div>
        </div>
      </div>

      <div className={styles.divider} />
      <p className={styles.phase}>Révision détaillée</p>

      <div className={styles.reviewList}>
        {results.map((r, i) => (
          <div key={r.questionId} className={`${styles.reviewItem} ${r.isCorrect ? styles.reviewOk : styles.reviewKo}`}>
            <i className={`ti ${r.isCorrect ? "ti-circle-check" : "ti-circle-x"}`} aria-hidden="true" />
            <div className={styles.reviewContent}>
              <p className={styles.reviewQ}>{r.question}</p>

              {/* Options QCM / VF */}
              {r.options && r.options.length > 0 && (
                <div className={styles.reviewOptions}>
                  {r.options.map((opt, oi) => {
                    const letter = LETTERS[oi];
                    const isCorrect = letter === r.correctAnswer.trim().toUpperCase();
                    const isUser = letter === r.userAnswer.trim().toUpperCase();
                    return (
                      <div
                        key={oi}
                        className={`${styles.reviewOption} ${
                          isCorrect ? styles.reviewOptionCorrect :
                          isUser && !isCorrect ? styles.reviewOptionWrong : ""
                        }`}
                      >
                        <span className={styles.reviewLetter}>{letter}</span>
                        {opt.replace(/^[A-D]\.\s*/, "")}
                        {isCorrect && <i className="ti ti-check" style={{ marginLeft: "auto" }} />}
                        {isUser && !isCorrect && <i className="ti ti-x" style={{ marginLeft: "auto" }} />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Question ouverte */}
              {r.type === "ouvert" && (
                <div className={styles.openAnswerRow}>
                  <div className={styles.userAnswerBox}>
                    <span className={styles.answerLabel}>Ta réponse</span>
                    <p>{r.userAnswer}</p>
                  </div>
                  <div className={styles.correctAnswerBox}>
                    <span className={styles.answerLabel}>Éléments attendus</span>
                    <p>{r.correctAnswer}</p>
                  </div>
                </div>
              )}

              {/* Explication */}
              {!r.isCorrect && (
                <p className={styles.reviewExplanation}>
                  <i className="ti ti-info-circle" aria-hidden="true" />
                  {r.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btn} onClick={onRestart}>
          <i className="ti ti-refresh" aria-hidden="true" /> Nouveau quiz
        </button>
        {wrongResults.length > 0 && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onRetryWrong(wrongResults.map((r) => r.questionId))}
          >
            <i className="ti ti-repeat" aria-hidden="true" />
            Refaire les erreurs ({wrongResults.length})
          </button>
        )}
      </div>
    </div>
  );
}