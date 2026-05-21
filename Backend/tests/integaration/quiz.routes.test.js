/**
 * quiz.routes.test.js
 * Tests d'intégration des routes quiz non couvertes :
 *   POST /api/quiz/:quizId/submit
 *   GET  /api/quiz/me
 *   GET  /api/quiz/course/:courseId
 * (POST /api/quiz/generate est déjà couvert dans api.e2e.test.js)
 */
import request from "supertest";
import app from "../../src/app.js";
import * as jwt from "../../src/config/jwt.js";
import * as quizRepo from "../../src/repositories/quiz.repository.js";
import * as courseRepo from "../../src/repositories/course.repository.js";
import * as answerRepo from "../../src/repositories/answer.repository.js";
import * as grok from "../../src/services/grok.service.js";

jest.mock("../../src/config/jwt.js");
jest.mock("../../src/repositories/quiz.repository.js");
jest.mock("../../src/repositories/course.repository.js");
jest.mock("../../src/repositories/answer.repository.js");
jest.mock("../../src/services/grok.service.js");

const mockUser = { id: "user1", role: "STUDENT" };

const mockQuiz = {
  id: "quiz1",
  courseId: "course1",
  userId: "user1",
  score: null,
  questions: [
    { id: "q1", type: "qcm", question: "Q1?", options: ["A. op1", "B. op2"], answer: "A", explanation: "exp1" },
    { id: "q2", type: "vf",  question: "Q2?", options: ["A. Vrai", "B. Faux"], answer: "B", explanation: "exp2" },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  jwt.verifyAccess.mockReturnValue(mockUser);
});

const authHeader = () => ({ Authorization: "Bearer mock-token" });

// ─── POST /api/quiz/:quizId/submit ────────────────────────────────────────────

describe("POST /api/quiz/:quizId/submit", () => {
  test("200 — soumet les réponses et renvoie le score", async () => {
    quizRepo.findQuizById.mockResolvedValue(mockQuiz);
    answerRepo.createAnswers.mockResolvedValue();
    quizRepo.updateQuizScore.mockResolvedValue({ ...mockQuiz, score: 50 });

    const res = await request(app)
      .post("/api/quiz/quiz1/submit")
      .set(authHeader())
      .send({
        answers: [
          { questionId: "q1", userAnswer: "A" }, // correct
          { questionId: "q2", userAnswer: "A" }, // incorrect
        ],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.score).toBe(50);
  });

  test("200 — score 100% si toutes les réponses sont correctes", async () => {
    quizRepo.findQuizById.mockResolvedValue(mockQuiz);
    answerRepo.createAnswers.mockResolvedValue();
    quizRepo.updateQuizScore.mockResolvedValue({ ...mockQuiz, score: 100 });

    const res = await request(app)
      .post("/api/quiz/quiz1/submit")
      .set(authHeader())
      .send({
        answers: [
          { questionId: "q1", userAnswer: "A" },
          { questionId: "q2", userAnswer: "B" },
        ],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.score).toBe(100);
  });

  test("404 — quiz introuvable", async () => {
    quizRepo.findQuizById.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/quiz/unknown/submit")
      .set(authHeader())
      .send({ answers: [] });

    expect(res.statusCode).toBe(404);
  });

  test("400 — body invalide (answers manquant)", async () => {
    const res = await request(app)
      .post("/api/quiz/quiz1/submit")
      .set(authHeader())
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test("401 — sans token", async () => {
    const res = await request(app)
      .post("/api/quiz/quiz1/submit")
      .send({ answers: [] });

    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /api/quiz/me ─────────────────────────────────────────────────────────

describe("GET /api/quiz/me", () => {
  test("200 — renvoie les quiz de l'utilisateur connecté", async () => {
    quizRepo.getUserQuizzes.mockResolvedValue([mockQuiz]);

    const res = await request(app)
      .get("/api/quiz/me")
      .set(authHeader());

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toBe("quiz1");
  });

  test("200 — tableau vide si aucun quiz", async () => {
    quizRepo.getUserQuizzes.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/quiz/me")
      .set(authHeader());

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("401 — sans token", async () => {
    const res = await request(app).get("/api/quiz/me");

    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /api/quiz/course/:courseId ───────────────────────────────────────────

describe("GET /api/quiz/course/:courseId", () => {
  test("200 — renvoie les quiz liés à un cours", async () => {
    quizRepo.findQuizzesByCourseId
      ? quizRepo.findQuizzesByCourseId.mockResolvedValue([mockQuiz])
      : quizRepo.getUserQuizzes.mockResolvedValue([mockQuiz]);

    const res = await request(app)
      .get("/api/quiz/course/course1")
      .set(authHeader());

    expect(res.statusCode).toBe(200);
  });

  test("401 — sans token", async () => {
    const res = await request(app).get("/api/quiz/course/course1");

    expect(res.statusCode).toBe(401);
  });
});

// ─── POST /api/quiz/generate ──────────────────────────────────────────────────

describe("POST /api/quiz/generate", () => {
  test("200 — génère un quiz complet", async () => {
    courseRepo.createCourse.mockResolvedValue({
      id: "course1", content: "Contenu", subject: "math", level: "easy",
    });
    grok.generateQuiz.mockResolvedValue([
      { type: "qcm", question: "Q?", options: ["A. op1", "B. op2"], answer: "A", explanation: "exp", order: 1 },
    ]);
    quizRepo.createQuizWithQuestions.mockResolvedValue({ id: "quiz1" });

    const res = await request(app)
      .post("/api/quiz/generate")
      .set(authHeader())
      .send({
        courseData: { title: "Algèbre", content: "Contenu", subject: "math", level: "easy" },
        quizConfig: { questionCount: 1, selectedTypes: ["qcm"] },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("quiz1");
  });

  test("400 — body invalide", async () => {
    const res = await request(app)
      .post("/api/quiz/generate")
      .set(authHeader())
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test("401 — sans token", async () => {
    const res = await request(app)
      .post("/api/quiz/generate")
      .send({ courseData: {}, quizConfig: {} });

    expect(res.statusCode).toBe(401);
  });
});