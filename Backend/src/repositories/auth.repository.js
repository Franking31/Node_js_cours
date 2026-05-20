import prisma from "../config/prisma.js";

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

export {
  findByEmail,
  findById,
  createUser,
};