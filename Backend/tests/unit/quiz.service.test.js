import * as service from "../../src/services/quiz.service.js";
import * as courseRepo from "../../src/repositories/course.repository.js";
import * as quizRepo from "../../src/repositories/quiz.repository.js";
import * as answerRepo from "../../src/repositories/answer.repository.js";
import * as grok from "../../src/services/grok.service.js";

jest.mock("../../src/repositories/course.repository.js");
jest.mock("../../src/repositories/quiz.repository.js");
jest.mock("../../src/repositories/answer.repository.js");
jest.mock("../../src/services/grok.service.js");

const mockCourse = {
  id: "course1",
  title: "Algèbre",
  content: "Contenu du cours...",
  subject: "math",
  level: "easy",
};

const mockQuestions = [
  { type: "qcm", question: "Q1 ?", options: ["A. opt1", "B. opt2"], answer: "A", explanation: "exp1", order: 1 },
  { type: "vf",  question: "Q2 ?", options: ["A. Vrai", "B. Faux"],  answer: "B", explanation: "exp2", order: 2 },
];

const mockQuiz = {
  id: "quiz1",
  courseId: "course1",
  userId: "user1",
  score: null,
  questions: [
    { id: "q1", ...mockQuestions[0] },
    { id: "q2", ...mockQuestions[1] },
  ],
};

beforeEach(() => jest.clearAllMocks());

// ─── generateQuiz ─────────────────────────────────────────────────────────────

describe("generateQuiz", () => {
  test("succès — crée le cours, appelle l'IA, enregistre le quiz", async () => {
    courseRepo.createCourse.mockResolvedValue(mockCourse);
    grok.generateQuiz.mockResolvedValue(mockQuestions);
    quizRepo.createQuizWithQuestions.mockResolvedValue(mockQuiz);

    const result = await service.generateQuiz({
      userId: "user1",
      courseData: { title: "Algèbre", content: "Contenu", subject: "math", level: "easy" },
      quizConfig: { questionCount: 2, selectedTypes: ["qcm", "vf"] },
    });

    expect(courseRepo.createCourse).toHaveBeenCalledWith({
      title: "Algèbre",
      content: "Contenu",
      subject: "math",
      level: "easy",
      userId: "user1",
    });

    expect(grok.generateQuiz).toHaveBeenCalledWith({
      courseText: mockCourse.content,
      subject: mockCourse.subject,
      level: mockCourse.level,
      questionCount: 2,
      selectedTypes: ["qcm", "vf"],
    });

    expect(quizRepo.createQuizWithQuestions).toHaveBeenCalled();
    expect(result).toEqual(mockQuiz);
  });

  test("remonte l'erreur si l'IA échoue", async () => {
    courseRepo.createCourse.mockResolvedValue(mockCourse);
    grok.generateQuiz.mockRejectedValue(new Error("Grok Error"));

    await expect(
      service.generateQuiz({
        userId: "user1",
        courseData: { title: "t", content: "c", subject: "s", level: "l" },
        quizConfig: { questionCount: 2, selectedTypes: ["qcm"] },
      })
    ).rejects.toThrow("Grok Error");

    expect(quizRepo.createQuizWithQuestions).not.toHaveBeenCalled();
  });
});

// ─── submitQuiz ───────────────────────────────────────────────────────────────

describe("submitQuiz", () => {
  test("succès — calcule le score et enregistre les réponses", async () => {
    quizRepo.findQuizById.mockResolvedValue(mockQuiz);
    answerRepo.createAnswers.mockResolvedValue();
    quizRepo.updateQuizScore.mockResolvedValue({ ...mockQuiz, score: 50 });

    const result = await service.submitQuiz({
      quizId: "quiz1",
      userId: "user1",
      answers: [
        { questionId: "q1", userAnswer: "A" }, // correct
        { questionId: "q2", userAnswer: "A" }, // incorrect (bonne réponse : B)
      ],
    });

    expect(answerRepo.createAnswers).toHaveBeenCalled();
    // 1 bonne sur 2 → score = 50
    expect(quizRepo.updateQuizScore).toHaveBeenCalledWith("quiz1", 50);
    expect(result.score).toBe(50);
  });

  test("score 100% si toutes les réponses sont correctes", async () => {
    quizRepo.findQuizById.mockResolvedValue(mockQuiz);
    answerRepo.createAnswers.mockResolvedValue();
    quizRepo.updateQuizScore.mockResolvedValue({ ...mockQuiz, score: 100 });

    const result = await service.submitQuiz({
      quizId: "quiz1",
      userId: "user1",
      answers: [
        { questionId: "q1", userAnswer: "A" }, // correct
        { questionId: "q2", userAnswer: "B" }, // correct
      ],
    });

    expect(quizRepo.updateQuizScore).toHaveBeenCalledWith("quiz1", 100);
    expect(result.score).toBe(100);
  });

  test("échec — quiz introuvable", async () => {
    quizRepo.findQuizById.mockResolvedValue(null);

    await expect(
      service.submitQuiz({ quizId: "unknown", userId: "user1", answers: [] })
    ).rejects.toThrow("Quiz not found");

    expect(answerRepo.createAnswers).not.toHaveBeenCalled();
  });

  test("échec — questionId inexistant dans le quiz", async () => {
    quizRepo.findQuizById.mockResolvedValue(mockQuiz);

    await expect(
      service.submitQuiz({
        quizId: "quiz1",
        userId: "user1",
        answers: [{ questionId: "inexistant", userAnswer: "A" }],
      })
    ).rejects.toThrow("Question not found");
  });
});

// ─── getMyQuizzes ─────────────────────────────────────────────────────────────

describe("getMyQuizzes", () => {
  test("retourne les quiz de l'utilisateur", async () => {
    quizRepo.getUserQuizzes.mockResolvedValue([mockQuiz]);

    const result = await service.getMyQuizzes("user1");

    expect(quizRepo.getUserQuizzes).toHaveBeenCalledWith("user1");
    expect(result).toEqual([mockQuiz]);
  });
});