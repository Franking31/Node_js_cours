import prisma from "../config/prisma.js";

async function createAnswers(data) {
  return prisma.answer.createMany({ data });
}

export { createAnswers };