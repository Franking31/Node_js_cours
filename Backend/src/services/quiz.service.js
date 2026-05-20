// src/modules/quiz/quiz.service.js

import { createCourse } from "../repositories/course.repository.js";
import { createQuizWithQuestions } from "../repositories/quiz.repository.js";
import { generateQuiz as _generateQuiz } from "./grok.service.js";

// validation simple
function normalizeQuestions(questions) {
  return questions.map((q, i) => ({
    type: q.type,
    question: q.question,
    options: q.options || [],
    answer: q.answer,
    explanation: q.explanation,
    order: Number(q.order || i + 1),
  }));
}

async function generateQuiz({
  userId,
  courseData,
  quizConfig,
}) {
  // 1. sauvegarder cours
  const course = await createCourse({
    title: courseData.title,
    content: courseData.content,
    subject: courseData.subject,
    level: courseData.level,
    userId,
  });

  // 2. appeler IA
  const rawQuestions = await _generateQuiz({
    courseText: course.content,
    subject: course.subject,
    level: course.level,
    questionCount: quizConfig.questionCount,
    selectedTypes: quizConfig.selectedTypes,
  });

  // 3. normaliser
  const questions = normalizeQuestions(rawQuestions);

  // 4. enregistrer quiz + questions (TRANSACTION)
  const quiz = await createQuizWithQuestions({
    courseId: course.id,
    userId,
    questionCount: quizConfig.questionCount,
    selectedTypes: quizConfig.selectedTypes,
    questions,
  });

  return quiz;
}

export {
  generateQuiz,
};