// src/modules/course/course.repository.js

import prisma from "../config/prisma.js";

async function createCourse(data) {
  return prisma.course.create({
    data,
  });
}

export  { createCourse };