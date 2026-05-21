import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz API",
      version: "1.0.0",
      description: "API de generation de quiz avec IA",
    },

    servers: [
      {
        url: "http://localhost:8000/api",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },

      schemas: {
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Keny",
            },
            email: {
              type: "string",
              example: "keny@gmail.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },

        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "keny@gmail.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },

        GenerateQuizInput: {
          type: "object",
          properties: {
            course: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  example: "Introduction JavaScript",
                },
                content: {
                  type: "string",
                  example:
                    "JavaScript est un langage de programmation...",
                },
                subject: {
                  type: "string",
                  example: "Programmation",
                },
                level: {
                  type: "string",
                  example: "debutant",
                },
              },
            },

            quizConfig: {
              type: "object",
              properties: {
                questionCount: {
                  type: "number",
                  example: 10,
                },

                selectedTypes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["qcm", "vf"],
                },
              },
            },
          },
        },
        QuizConfigInput: {
          type: "object",
          properties: {
            courseId: {
              type: "string",
              example: "course_123",
            },
            questionCount: {
              type: "number",
              example: 10,
            },
            selectedTypes: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["qcm", "vf"],
            },
          },
        },
        SubmitQuizInput: {
          type: "object",
          properties: {
            answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  questionId: {
                    type: "string",
                    example: "question_123",
                  },
                  answer: {
                    type: "string",
                    example: "Ma reponse",
                  },
                },
              },
            },
          },
          },
      },
    },

    security: [
      {
        cookieAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
//   if (process.env.NODE_ENV === "production") {
//     return;
//   }

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

export default setupSwagger;