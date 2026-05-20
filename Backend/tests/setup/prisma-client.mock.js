export class PrismaClient {
    constructor() {
        return {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
            course: {
                create: jest.fn(),
            },
            quiz: {
                create: jest.fn(),
            },
        };
    }
}