
import { generateQuiz, submitQuiz, getMyQuizzes as _getMyQuizzes  } from "../services/quiz.service.js";

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

async function submit(req, res) {
  try {
    const userId = req.user.id;

    const { quizId } = req.params;

    const { answers } = req.body;

    const result = await submitQuiz({
      quizId,
      userId,
      answers,
    });

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
}

async function getMyQuizzes(req, res) {
  try {
    const quizzes = await _getMyQuizzes(
      req.user.id
    );

    res.json(quizzes);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
}


export default { generate, submit, getMyQuizzes, };