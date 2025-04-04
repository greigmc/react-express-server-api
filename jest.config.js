export default {
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)",
    ],
    testPathIgnorePatterns: [
      "/node_modules/",
    ],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
  };
  