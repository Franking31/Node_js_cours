import * as service from "../../src/services/quiz.service.js";
import * as courseRepo from "../../src/repositories/course.repository.js";
import * as quizRepo from "../../src/repositories/quiz.repository.js";
import * as grok from "../../src/services/grok.service.js";

jest.mock("../../src/repositories/course.repository.js");
jest.mock("../../src/repositories/quiz.repository.js");
jest.mock("../../src/services/grok.service.js");

describe("Quiz Service", () => {
    test("generateQuiz - success", async() => {
        courseRepo.createCourse.mockResolvedValue({
            id: "course1",
            content: "cours",
            subject: "math",
            level: "easy",
        });

        grok.generateQuiz.mockResolvedValue([{
            type: "qcm",
            question: "Q1",
            options: ["A", "B"],
            answer: "A",
            explanation: "exp",
            order: 1,
        }, ]);

        quizRepo.createQuizWithQuestions.mockResolvedValue({ id: "quiz1" });

        const result = await service.generateQuiz({
            userId: "123",
            courseData: { title: "t", content: "c", subject: "s", level: "l" },
            quizConfig: { questionCount: 1, selectedTypes: ["qcm"] },
        });

        expect(result).toBeDefined();
        expect(quizRepo.createQuizWithQuestions).toHaveBeenCalled();
    });
});