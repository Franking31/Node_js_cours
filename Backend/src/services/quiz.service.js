// src/modules/quiz/quiz.service.js

import { createAnswers } from "../repositories/answer.repository.js";
import { createCourse } from "../repositories/course.repository.js";
import { createQuizWithQuestions, 
  findQuizById,
  updateQuizScore,
  getUserQuizzes, } from "../repositories/quiz.repository.js";
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

function evaluateAnswer(question, userAnswer) {
  if (question.type === "ouvert") {
    return true;
  }

  return (
    question.answer.trim().toLowerCase() ===
    userAnswer.trim().toLowerCase()
  );
}

async function submitQuiz({
  quizId,
  userId,
  answers,
}) {
  const quiz = await findQuizById(quizId);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  let correctCount = 0;

  const formattedAnswers = answers.map((a) => {
    const question = quiz.questions.find(
      (q) => q.id === a.questionId
    );

    if (!question) {
      throw new Error("Question not found", question);
    }

    const isCorrect = evaluateAnswer(
      question,
      a.userAnswer
    );

    if (isCorrect) {
      correctCount++;
    }

    return {
      quizId,
      questionId: question.id,
      userId,
      userAnswer: a.userAnswer,
      isCorrect,
    };
  });

  await createAnswers(formattedAnswers);

  const score =
    (correctCount / quiz.questions.length) * 100;

  const updatedQuiz = await updateQuizScore(
    quizId,
    score
  );

  return {
    ...updatedQuiz,
    score,
  };
}

async function getMyQuizzes(userId) {
  return getUserQuizzes(userId);
}

async function getQuizzesByCourse(courseId) {
  return findQuizzesByCourseId(courseId);
}


export {
  generateQuiz,
  submitQuiz,
  getMyQuizzes,
  getQuizzesByCourse,
};