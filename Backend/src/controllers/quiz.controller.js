// src/modules/quiz/quiz.controller.js

import { generateQuiz } from "../services/quiz.service.js";

async function generate(req, res) {
  try {
    const userId = req.user.id;

    const { course, quizConfig } = req.body;

    const quiz = await generateQuiz({
      userId,
      courseData: course,
      quizConfig,
    });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default { generate };