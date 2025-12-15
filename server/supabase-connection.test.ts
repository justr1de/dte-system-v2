import { describe, it, expect } from "vitest";

describe("Supabase Connection", () => {
  describe("Environment Variables", () => {
    it("should have SUPABASE_URL configured", () => {
      const supabaseUrl = process.env.SUPABASE_URL;
      expect(supabaseUrl).toBeDefined();
      expect(supabaseUrl).not.toBe("");
      expect(supabaseUrl).toMatch(/^https:\/\/.+\.supabase\.co$/);
    });

    it("should have SUPABASE_DATABASE_URL configured", () => {
      const databaseUrl = process.env.SUPABASE_DATABASE_URL;
      expect(databaseUrl).toBeDefined();
      expect(databaseUrl).not.toBe("");
      // PostgreSQL connection string format
      expect(databaseUrl).toMatch(/^postgres(ql)?:\/\/.+/);
    });
  });

  describe("URL Format Validation", () => {
    it("should have valid Supabase URL format", () => {
      const url = process.env.SUPABASE_URL || "";
      const urlPattern = /^https:\/\/[a-z0-9]+\.supabase\.co$/;
      expect(urlPattern.test(url)).toBe(true);
    });

    it("should have valid PostgreSQL connection string", () => {
      const dbUrl = process.env.SUPABASE_DATABASE_URL || "";
      // Should contain host, port, database name
      expect(dbUrl).toContain("@");
      expect(dbUrl).toContain(":");
    });
  });
});
