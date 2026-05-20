import { z } from "zod";

const quizSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string().min(3),

      content: z.string().min(100),

      subject: z.string().min(2).max(200),

      level: z.string().min(1),
    }),

    quizConfig: z.object({
      questionCount: z.number().min(5).max(30).default(15),

      selectedTypes: z
        .array(
          z.enum(["qcm", "vf", "ouvert"])
        )
        .min(1)
        .default(["qcm"]),
    }),
  })
});


const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string(),

        userAnswer: z.string(),
      })
    ),
  }),
});


export { quizSchema, submitQuizSchema };