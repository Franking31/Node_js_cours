"use client";
import { useEffect, useState } from "react";
import styles from "../modules/LoadingPhase.module.css";

const STEPS = [
  "Lecture du cours",
  "Extraction des concepts clés",
  "Génération des questions",
  "Validation des réponses",
];

export default function LoadingPhase() {
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    STEPS.forEach((_, i) => {
      setTimeout(() => setDoneSteps((prev) => [...prev, i]), 800 + i * 700);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <h3>Analyse en cours…</h3>
      <p>L&apos;IA lit ton cours et prépare les questions</p>
      <ul className={styles.stepList}>
        {STEPS.map((label, i) => (
          <li key={i} className={`${styles.step} ${doneSteps.includes(i) ? styles.done : ""}`}>
            <i className={`ti ${doneSteps.includes(i) ? "ti-circle-check" : "ti-circle"}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}