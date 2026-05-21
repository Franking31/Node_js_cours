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

async function findQuizById(id) {
  return prisma.quiz.findUnique({
    where: { id },

    include: {
      questions: true,
      answers: true,
    },
  });
}

async function findQuizzesByCourseId(courseId) {
  return prisma.quiz.findMany({
    where: { courseId },
    include: {
      questions: true,
      answers: true,
    },
  });
}

async function updateQuizScore(id, score) {
  return prisma.quiz.update({
    where: { id },

    data: {
      score,
      status: "DONE",
      completedAt: new Date(),
    },

    include: {
      questions: true,
      answers: true,
    },
  });
}

async function getUserQuizzes(userId) {
  return prisma.quiz.findMany({
    where: {
      userId,
    },

    include: {
      course: true,
      questions: true,
      answers: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}



export {
  findQuizById,
  updateQuizScore,
  getUserQuizzes,
  createQuizWithQuestions,
  findQuizzesByCourseId,
};

