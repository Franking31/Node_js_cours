// prisma.mock.js — mock du client Prisma couvrant tous les modèles utilisés
export default {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  course: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  quiz: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  question: {
    createMany: jest.fn(),
  },
  answer: {
    createMany: jest.fn(),
  },
  $transaction: jest.fn((fn) => fn(this)),
};