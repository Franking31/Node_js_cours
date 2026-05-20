// src/modules/quiz/quiz.repository.js

import prisma from "../config/prisma.js";

async function createQuizWithQuestions(data) {
  return prisma.quiz.create({
    data: {
      courseId: data.courseId,
      userId: data.userId,
      questionCount: data.questionCount,
      types: data.selectedTypes,
      status: "ACTIVE",

      questions: {
        create: data.questions,
      },
    },
    include: {
      questions: true,
    },
  });
}

export { createQuizWithQuestions };