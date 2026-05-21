// jest.config.js
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  setupFiles: ["<rootDir>/tests/setup/test.env.js"],
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.test.JS",
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/env.js",
    "!src/config/prisma.js",
    "!src/prisma/**",
    "!src/__mocks__/**",
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
      branches: 60,
      statements: 70,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
};