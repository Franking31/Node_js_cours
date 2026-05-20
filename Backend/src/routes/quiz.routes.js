// src/modules/quiz/quiz.routes.js

import { Router } from "express";
const router = Router();

import quizController from "../controllers/quiz.controller.js";
import auth from "../middlewares/auth.middleware.js";

router.post("/generate", auth, quizController.generate  );

export default router;