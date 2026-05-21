/**
 * api.e2e.test.js
 * Tests end-to-end du flux principal — tous les accès DB et JWT sont mockés
 * pour éviter toute dépendance à une base réelle.
 */
import request from "supertest";
import app from "../../src/app.js";
import * as repo from "../../src/repositories/auth.repository.js";
import * as jwt from "../../src/config/jwt.js";
import * as quizRepo from "../../src/repositories/quiz.repository.js";
import * as courseRepo from "../../src/repositories/course.repository.js";
import * as answerRepo from "../../src/repositories/answer.repository.js";
import * as grok from "../../src/services/grok.service.js";
import bcrypt from "bcrypt";

jest.mock("../../src/repositories/auth.repository.js");
jest.mock("../../src/repositories/quiz.repository.js");
jest.mock("../../src/repositories/course.repository.js");
jest.mock("../../src/repositories/answer.repository.js");
jest.mock("../../src/services/grok.service.js");
jest.mock("../../src/config/jwt.js");
jest.mock("bcrypt");

const mockUser = { id: "user1", email: "test@test.com", name: "John", role: "STUDENT", password: "hashed" };

beforeEach(() => {
  jest.clearAllMocks();
  jwt.signAccessToken.mockReturnValue("access-token");
  jwt.signRefreshToken.mockReturnValue("refresh-token");
  jwt.verifyAccess.mockReturnValue({ id: "user1", role: "STUDENT" });
});

// ─── Flux complet : register → login ─────────────────────────────────────────

describe("E2E — flux auth complet", () => {
  test("register puis login avec les mêmes credentials", async () => {
    // register
    repo.findByEmail.mockResolvedValueOnce(null);
    bcrypt.hash.mockResolvedValue("hashed");
    repo.createUser.mockResolvedValue(mockUser);

    const register = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "12345678", name: "John" });

    expect(register.statusCode).toBe(200);
    expect(register.body.accessToken).toBe("access-token");

    // login
    repo.findByEmail.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "12345678" });

    expect(login.statusCode).toBe(200);
    expect(login.body.accessToken).toBe("access-token");
  });
});

// ─── Flux complet : login → générer un quiz ───────────────────────────────────

describe("E2E — flux quiz complet", () => {
  test("login puis génération d'un quiz", async () => {
    // login
    repo.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "12345678" });

    expect(login.statusCode).toBe(200);
    const token = login.body.accessToken;

    // generate quiz
    courseRepo.createCourse.mockResolvedValue({
      id: "course1",
      content: "Contenu",
      subject: "math",
      level: "easy",
    });
    grok.generateQuiz.mockResolvedValue([
      { type: "qcm", question: "Q?", options: ["A. op1", "B. op2"], answer: "A", explanation: "exp", order: 1 },
    ]);
    quizRepo.createQuizWithQuestions.mockResolvedValue({ id: "quiz1" });

    const quiz = await request(app)
      .post("/api/quiz/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseData: { title: "Algèbre", content: "Contenu", subject: "math", level: "easy" },
        quizConfig: { questionCount: 1, selectedTypes: ["qcm"] },
      });

    expect(quiz.statusCode).toBe(200);
    expect(quiz.body.id).toBe("quiz1");
  });

  test("quiz protégé — 401 sans token", async () => {
    const res = await request(app)
      .post("/api/quiz/generate")
      .send({ courseData: {}, quizConfig: {} });

    expect(res.statusCode).toBe(401);
  });
});

// ─── Flux complet : soumettre un quiz ─────────────────────────────────────────

describe("E2E — soumettre un quiz", () => {
  test("submit quiz → score calculé", async () => {
    const mockQuiz = {
      id: "quiz1",
      questions: [
        { id: "q1", type: "qcm", answer: "A" },
      ],
    };

    quizRepo.findQuizById.mockResolvedValue(mockQuiz);
    answerRepo.createAnswers.mockResolvedValue();
    quizRepo.updateQuizScore.mockResolvedValue({ ...mockQuiz, score: 100 });

    const res = await request(app)
      .post("/api/quiz/quiz1/submit")
      .set("Authorization", "Bearer access-token")
      .send({ answers: [{ questionId: "q1", userAnswer: "A" }] });

    expect(res.statusCode).toBe(200);
    expect(res.body.score).toBe(100);
  });
});