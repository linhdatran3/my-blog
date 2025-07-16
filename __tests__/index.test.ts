import { describe, it, expect } from "@jest/globals";

describe("Basic Test Suite", () => {
  it("should pass basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have correct environment variables", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
