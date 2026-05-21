import prisma from "../config/prisma.js";


async function createAnswers(datas) {
  return prisma.answer.createMany({
    data: {
        quizId: datas.quizId,
        questionId: datas.questionId,
        userId: datas.userId,
        userAnswer: datas.userAnswer,
        isCorrect: datas.isCorrect
    },
  });
}

export { createAnswers };
