import { Question, QuizConfig } from "./types";

export async function generateQuiz(config: QuizConfig): Promise<Question[]> {
  const { courseText, subject, level, questionCount, selectedTypes } = config;

  const typesLabel = selectedTypes
    .map((t) => (t === "qcm" ? "QCM" : t === "vf" ? "Vrai/Faux" : "Question ouverte"))
    .join(", ");

  const prompt = `Tu es un professeur expert en ${subject}. Génère exactement ${questionCount} questions de quiz en JSON basées sur ce cours.

COURS :
"""
${courseText.substring(0, 6000)}
"""

Types à inclure : ${typesLabel}
Niveau : ${level}

FORMAT JSON STRICT — retourne UNIQUEMENT un tableau JSON valide, aucun texte avant ou après :
[
  {
    "type": "qcm",
    "question": "texte de la question",
    "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
    "answer": "A",
    "explanation": "explication courte de la bonne réponse"
  },
  {
    "type": "vf",
    "question": "Affirmation à évaluer...",
    "options": ["A. Vrai", "B. Faux"],
    "answer": "A",
    "explanation": "explication"
  },
  {
    "type": "ouvert",
    "question": "Question ouverte...",
    "answer": "Éléments de réponse attendus : ...",
    "explanation": "points clés à mentionner"
  }
]

Répartis les ${questionCount} questions équitablement selon les types demandés. Varie la difficulté. Questions pertinentes et précises basées UNIQUEMENT sur le cours fourni.`;

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Erreur API");

  const data = await response.json();
  const raw: string = data.content;

  let parsed = raw.replace(/```json|```/g, "").trim();
  const start = parsed.indexOf("[");
  const end = parsed.lastIndexOf("]");
  if (start >= 0 && end > start) parsed = parsed.substring(start, end + 1);

  const questions: Question[] = JSON.parse(parsed);
  if (!Array.isArray(questions) || questions.length === 0) throw new Error("Format invalide");

  return questions;
}