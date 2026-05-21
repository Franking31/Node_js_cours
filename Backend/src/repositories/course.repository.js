// src/modules/course/course.repository.js

import prisma from "../config/prisma.js";

async function createCourse(data) {
  return prisma.course.create({
    data,
  });
}

async function findCourseById(id) {
  return prisma.course.findUnique({
    where: { id },
  });
}

async function findCoursesByUserId(userId) {
  return prisma.course.findMany({
    where: { userId },
  });
}

async function deleteCourse(id) {
  return prisma.course.delete({
    where: { id },
  });
}

export  { createCourse, findCourseById, findCoursesByUserId, deleteCourse };
