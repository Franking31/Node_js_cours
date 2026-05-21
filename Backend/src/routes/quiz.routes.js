// src/modules/quiz/quiz.routes.js

import { Router } from "express";
import quizController from "../controllers/quiz.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from '../middlewares/validate.middleware.js'
import {quizConfigSchema, quizSchema, submitQuizSchema} from '../validators/quiz.validator.js'
const router = Router();


router.post(
    "/generate", 
    auth, 
    validate(quizSchema), 
    quizController.generate  
);

router.post(
  "/generate/course/:courseId",
  auth,
  validate(quizConfigSchema),
  quizController.getQuizzesByCourse
);

router.post(
  "/:quizId/submit",
  auth,
  validate(submitQuizSchema),
  quizController.submit
);

router.get(
  "/me",
  auth,
  quizController.getMyQuizzes
);

router.get(
  "/course/:courseId",
  auth,
  quizController.getQuizzesByCourse
);



export default router;