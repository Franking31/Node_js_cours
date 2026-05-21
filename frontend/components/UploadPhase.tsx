"use client";
import { useState } from "react";
import { QuizConfig, QuestionType } from "@/lib/types";
import styles from "../modules/UploadPhase.module.css";

interface Props {
  onGenerate: (config: QuizConfig) => void;
}

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "qcm", label: "QCM" },
  { value: "vf", label: "Vrai / Faux" },
  { value: "ouvert", label: "Questions ouvertes" },
];

export default function UploadPhase({ onGenerate }: Props) {
  const [content, setContent] = useState(""); 
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("licence3");
  const [questionCount, setQuestionCount] = useState(20);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(["qcm", "vf", "ouvert"]);
  const [dragging, setDragging] = useState(false);

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text.substring(0, 8000));
    };
    reader.readAsText(file);
  }

  function toggleType(t: QuestionType) {
    setSelectedTypes((prev) =>
      prev.includes(t)
        ? prev.length > 1 ? prev.filter((x) => x !== t) : prev
        : [...prev, t]
    );
  }

  function handleSubmit() {
  if (!content.trim() || content.trim().length < 50) {
    alert("Merci de coller un cours d'au moins 50 caractères.");
    return;
  }
  if (!title.trim()) {
    alert("Merci de donner un titre à ton cours.");
    return;
  }
      onGenerate({
    title: title.trim(),
    content,                                   // ← était courseText
    subject: subject || "Général",
    level: level as any,
    questionCount,
    selectedTypes,
  });
}

  return (
    <div className={styles.container}>
      <p className={styles.phase}>Étape 1 — Importer le cours</p>

      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`}
        onClick={() => document.getElementById("fileInput")?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) readFile(f);
        }}
      >
        <i className="ti ti-upload" aria-hidden="true" />
        <h3>Glisse ton fichier ici ou clique pour sélectionner</h3>
        <p>Formats acceptés : .txt, .md, .pdf (texte extractable)</p>
        <input
          id="fileInput"
          type="file"
          accept=".txt,.md,.pdf"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); }}
        />
      </div>

      <div className={styles.orDivider}>
        <span>ou colle directement</span>
      </div>

      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={"Colle ici le contenu de ton cours…\n\nEx : La photosynthèse est le processus par lequel les plantes convertissent la lumière solaire en énergie chimique stockée..."}
        rows={8}
      />

      <div className={styles.metaRow}>
  <div className={styles.field}>
    <label>Titre du cours</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Ex : Biologie cellulaire — Cours 3"
    />
  </div>
  <div className={styles.field}>
    <label>Matière / Module</label>
    <input
      type="text"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      placeholder="Ex : Biologie cellulaire"
    />
  </div>
  <div className={styles.field}>
    <label>Niveau</label>
    <select value={level} onChange={(e) => setLevel(e.target.value)}>
      <option value="licence1">Licence 1</option>
      <option value="licence2">Licence 2</option>
      <option value="licence3">Licence 3</option>
      <option value="master1">Master 1</option>
      <option value="master2">Master 2</option>
    </select>
  </div>
</div>
      <div className={styles.divider} />
      <p className={styles.phase}>Type de questions</p>

      <div className={styles.pillGroup}>
        {TYPE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.pill} ${selectedTypes.includes(value) ? styles.active : ""}`}
            onClick={() => toggleType(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.sliderRow}>
        <label>
          Nombre de questions
          <span>{questionCount}</span>
        </label>
        <input
          type="range"
          min={10}
          max={30}
          step={5}
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        />
      </div>

      <div className={styles.btnRow}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
          <i className="ti ti-sparkles" aria-hidden="true" />
          Générer le quiz
        </button>
      </div>
    </div>
  );
}