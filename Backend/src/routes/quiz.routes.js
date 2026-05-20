// src/modules/quiz/quiz.routes.js

import { Router } from "express";
import quizController from "../controllers/quiz.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from '../middlewares/validate.middleware.js'
import {quizSchema} from '../validators/quiz.validator.js'
const router = Router();


router.post("/generate", auth, validate(quizSchema), quizController.generate  );

export default router;