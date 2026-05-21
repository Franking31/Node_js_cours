// src/modules/quiz/quiz.routes.js

import { Router } from "express";
import quizController from "../controllers/quiz.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from '../middlewares/validate.middleware.js'
import {quizConfigSchema, quizSchema, submitQuizSchema} from '../validators/quiz.validator.js'
const router = Router();

/**
 * @swagger
 * /quiz/generate:
 *   post:
 *     summary: Generer un quiz avec IA
 *     tags:
 *       - Quiz
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateQuizInput'
 *     responses:
 *       200:
 *         description: Quiz genere
 */
router.post(
    "/generate", 
    auth, 
    validate(quizSchema), 
    quizController.generate  
);

/**
 * @swagger
 * /quiz/generate/course/{courseId}:
 *   post:
 *     summary: Generer un quiz pour un cours
 *     tags:
 *       - Quiz
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID du cours
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizConfigInput'
 *     responses:
 *       200:
 *         description: Quiz genere
 */
router.post(
  "/generate/course/:courseId",
  auth,
  validate(quizConfigSchema),
  quizController.getQuizzesByCourse
);

/**
 * @swagger
 * /quiz/{quizId}/submit:
 *   post:
 *     summary: Soumettre un quiz
 *     tags:
 *       - Quiz
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         description: ID du quiz
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitQuizInput'
 *     responses:
 *       200:
 *         description: Quiz soumis avec succes
 */
router.post(
  "/:quizId/submit",
  auth,
  validate(submitQuizSchema),
  quizController.submit
);


/** * @swagger
 * /quiz/me:
 *   get:
 *     summary: Obtenir mes quizzes
 *     tags:
 *       - Quiz
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des quizzes de l'utilisateur
 */
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