export default {
    testEnvironment: "node",
    transform: {},
    moduleFileExtensions: ["js", "json"],
    roots: ["<rootDir>/tests"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup/test.env.js"],
    moduleNameMapper: {
        "^@prisma/client$": "<rootDir>/tests/setup/prisma-client.mock.js"
    }
};