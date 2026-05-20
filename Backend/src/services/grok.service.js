
import { env } from "../config/env.js";
import {z} from 'zod'
import Grok from 'groq-sdk'


const generateQuiz = async ({ courseText, subject, level, questionCount, selectedTypes, retry = true }) => {

  try {
    const typesLabel = selectedTypes
    .map((t) => (t === "qcm" ? "QCM" : t === "vf" ? "Vrai/Faux" : "Question ouverte"))
    .join(", ");

  const instructions = `Tu es un professeur expert en ${subject}`;

  const prompt = `Génère exactement ${questionCount} questions de quiz en JSON basées sur ce cours.

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
        "explanation": "explication courte de la bonne réponse",
        "order": "ordre d'affichage de la question"
    },
    {
        "type": "vf",
        "question": "Affirmation à évaluer...",
        "options": ["A. Vrai", "B. Faux"],
        "answer": "A",
        "explanation": "explication",
        "order":  "2"
    },
    {
        "type": "ouvert",
        "question": "Question ouverte...",
        "answer": "Éléments de réponse attendus : ...",
        "explanation": "points clés à mentionner",
        "3"
    }
    ]

    Répartis les ${questionCount} questions équitablement selon les types demandés. Varie la difficulté. Questions pertinentes et précises basées UNIQUEMENT sur le cours fourni.`;

    const response = await handleGrok({ prompt, instructions });
    return handleAiResponse(response);
  } catch (error) {
    if(error.message !== "Grok Error"){
      return generateQuiz({ courseText, subject, level, questionCount, selectedTypes, retry : false });
    }
    throw new Error(error);
    
  }
    
    
}


export {generateQuiz}




const QuestionSchema = z.object({
  type: z.enum(["qcm", "vf", "ouvert"]),
  question: z.string().min(1),

  options: z.array(z.string()).optional(),

  answer: z.string(),

  explanation: z.string(),

  order: z.number(),
});

const QuizSchema = z.array(QuestionSchema);

function extractJson(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON found");

  return match[0];
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON format from AI");
  }
}

function normalizeQuestions(data) {
  return data.map((q, index) => ({
    ...q,
    order: Number(q.order ?? index + 1),
  }));
}

function handleAiResponse(rawText) {
  const jsonString = extractJson(rawText);
  let data = JSON.parse(jsonString);

  data = normalizeQuestions(data);

  const validated = QuizSchema.parse(data);

  return validated;
}

const handleGrok = async ({prompt, instructions = ''}) =>{
    try {
      const groq = new Grok({apiKey: env.GROQUERY_API_KEY})
      const response =await  groq.chat.completions.create({
        messages: [
          {
            role:'system',
            content: instructions
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        top_p: 1,
        max_completion_tokens: 4096,
      });

    return response.choices[0]?.message?.content || "";
    } catch (error) {
      throw new Error("Grok Error");
      
    }
}