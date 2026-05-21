import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';
import z from 'zod';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const adminSchema = z.object({
  ADMIN_NAME: z.string().min(1),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(6),
});


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dataPath = path.join(
  __dirname,
  "data.json"
);

const seedData = JSON.parse(
  fs.readFileSync(dataPath, "utf-8")
);

async function createAdmin() {
    const adminData = adminSchema.parse(process.env);
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminData.ADMIN_EMAIL,
    },
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(
    adminData.ADMIN_PASSWORD,
    10
  );

  const admin = await prisma.user.create({
    data: {
      name: adminData.ADMIN_NAME,
      email: adminData.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin created');

  return admin;
}

async function createStudents() {
  for (const studentData of seedData.students) {

    const existingStudent = await prisma.user.findUnique({
      where: {
        email: studentData.email,
      },
    });

    let student;

    if (!existingStudent) {

      const hashedPassword = await bcrypt.hash(
        studentData.password,
        10
      );

      student = await prisma.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      console.log(`Student created: ${student.email}`);

    } else {

      student = existingStudent;

      console.log(`Student already exists: ${student.email}`);
    }

    for (const courseData of studentData.courses) {

      const course = await prisma.course.create({
        data: {
          title: courseData.title,
          content: courseData.content,
          subject: courseData.subject,
          level: courseData.level,
          userId: student.id,
        },
      });

      console.log(`Course created: ${course.title}`);

      const quiz = await prisma.quiz.create({
        data: {
          courseId: course.id,
          userId: student.id,
          questionCount: 3,
          types: ['qcm', 'vf'],
          status: 'DONE',
          score: 66.67,
          completedAt: new Date(),

          questions: {
            create: [
              {
                type: 'qcm',
                question: 'Quelle est la bonne reponse ?',
                options: [
                  'A. Option 1',
                  'B. Option 2',
                  'C. Option 3',
                  'D. Option 4'
                ],
                answer: 'A',
                explanation: 'Option A est correcte',
                order: 1,
              },
              {
                type: 'vf',
                question: 'JavaScript est un langage compile.',
                options: [
                  'A. Vrai',
                  'B. Faux'
                ],
                answer: 'B',
                explanation: 'JavaScript est principalement interprete.',
                order: 2,
              },
              {
                type: 'ouvert',
                question: 'Explique le role d une base de donnees.',
                options: [],
                answer: 'Stocker et organiser les donnees.',
                explanation: 'Une base de donnees permet de gerer les informations.',
                order: 3,
              }
            ]
          }
        },

        include: {
          questions: true,
        },
      });

      await prisma.answer.createMany({
        data: quiz.questions.map((q, index) => ({
          quizId: quiz.id,
          questionId: q.id,
          userId: student.id,
          userAnswer:
            index === 0
              ? 'A'
              : index === 1
              ? 'B'
              : 'Une base de donnees stocke les informations.',
          isCorrect: true,
        })),
      });

      console.log(`Quiz created for course: ${course.title}`);
    }
  }
}

async function main() {
  console.log('Starting seed...');

  await createAdmin();

  await createStudents();

  console.log('Seed completed');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });