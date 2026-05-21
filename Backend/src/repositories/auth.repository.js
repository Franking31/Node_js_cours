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

async function updateUser(id, updateData) {
  return  prisma.user.update({ where: { id }, data: {
    email: updateData.email,
    name: updateData.name,
  } });
}

async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

async function getAllUsers(currentUserId) {
  return prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
    },
  });
}

export {
  findByEmail,
  findById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};