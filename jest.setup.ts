import "@testing-library/jest-dom";
import { PrismaClient } from "@prisma/client";

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
