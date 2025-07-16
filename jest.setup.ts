/* eslint @typescript-eslint/no-require-imports: "off" */

import "@testing-library/jest-dom";
if (process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID) {
  const { PrismaClient } = require("@prisma/client");

  // Mock Prisma Client
  jest.mock("./lib/prisma", () => ({
    prisma: new PrismaClient(),
  }));

  // Setup global test environment
  beforeAll(async () => {
    // Setup test database if needed
  });

  afterAll(async () => {
    // Cleanup after tests
  });
}
