export default {
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