import { describe, it, expect } from "vitest";
import { RecallItem } from "../types/index";

describe("Deeplink Detection Logic", () => {
  // Deeplink detection function from CreateRecallModal
  const isDeeplink = (text: string): boolean => {
    const deeplinkPatterns = [
      /^https?:\/\//i, // HTTP/HTTPS URLs
      /^[a-z][a-z0-9+.-]*:\/\//i, // App-specific schemes (e.g., maps://, tel:, etc.)
    ];
    return deeplinkPatterns.some((pattern) => pattern.test(text.trim()));
  };

  describe("URL Detection", () => {
    it("should detect HTTP URLs", () => {
      expect(isDeeplink("http://example.com")).toBe(true);
    });

    it("should detect HTTPS URLs", () => {
      expect(isDeeplink("https://example.com")).toBe(true);
    });

    it("should detect HTTPS URLs with paths", () => {
      expect(isDeeplink("https://example.com/path/to/page")).toBe(true);
    });

    it("should detect HTTPS URLs with query params", () => {
      expect(isDeeplink("https://example.com?param=value")).toBe(true);
    });

    it("should detect HTTP (lowercase)", () => {
      expect(isDeeplink("http://example.com")).toBe(true);
    });

    it("should detect HTTPS (mixed case)", () => {
      expect(isDeeplink("HtTpS://example.com")).toBe(true);
    });
  });

  describe("App Scheme Detection", () => {
    it("should detect maps scheme", () => {
      expect(isDeeplink("maps://")).toBe(true);
    });

    it("should detect tel scheme", () => {
      expect(isDeeplink("tel://")).toBe(true);
    });

    it("should detect mailto scheme", () => {
      expect(isDeeplink("mailto://")).toBe(true);
    });

    it("should detect custom app schemes", () => {
      expect(isDeeplink("myapp://action")).toBe(true);
    });

    it("should detect schemes with hyphens", () => {
      expect(isDeeplink("my-app://")).toBe(true);
    });

    it("should detect schemes with dots", () => {
      expect(isDeeplink("my.app://")).toBe(true);
    });

    it("should detect schemes with plus signs", () => {
      expect(isDeeplink("my+app://")).toBe(true);
    });
  });

  describe("Non-Deeplink Detection", () => {
    it("should not detect plain text", () => {
      expect(isDeeplink("This is plain text")).toBe(false);
    });

    it("should not detect partial URLs", () => {
      expect(isDeeplink("example.com")).toBe(false);
    });

    it("should not detect URLs without scheme", () => {
      expect(isDeeplink("www.example.com")).toBe(false);
    });

    it("should not detect text with URL in middle", () => {
      expect(isDeeplink("Check out https://example.com for more")).toBe(false);
    });

    it("should not detect empty string", () => {
      expect(isDeeplink("")).toBe(false);
    });

    it("should not detect whitespace only", () => {
      expect(isDeeplink("   ")).toBe(false);
    });
  });

  describe("Whitespace Handling", () => {
    it("should trim leading whitespace before detection", () => {
      expect(isDeeplink("  http://example.com")).toBe(true);
    });

    it("should trim trailing whitespace before detection", () => {
      expect(isDeeplink("http://example.com  ")).toBe(true);
    });

    it("should trim both leading and trailing whitespace", () => {
      expect(isDeeplink("  https://example.com  ")).toBe(true);
    });
  });

  describe("RecallItem with isDeeplink flag", () => {
    it("should store deeplink flag when creating item with URL title", () => {
      const item: RecallItem = {
        id: 1,
        title: "https://example.com/checklist",
        description: "Link to checklist",
        phases: ["Preflight"],
        reference: "",
        isDeeplink: isDeeplink("https://example.com/checklist"),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(item.isDeeplink).toBe(true);
    });

    it("should store deeplink flag when creating item with app scheme", () => {
      const item: RecallItem = {
        id: 1,
        title: "maps://coordinates",
        description: "Link to coordinates",
        phases: ["Approach"],
        reference: "",
        isDeeplink: isDeeplink("maps://coordinates"),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(item.isDeeplink).toBe(true);
    });

    it("should not set deeplink flag for normal text", () => {
      const item: RecallItem = {
        id: 1,
        title: "Check fuel gauge",
        description: "Verify fuel before takeoff",
        phases: ["Preflight"],
        reference: "",
        isDeeplink: isDeeplink("Check fuel gauge"),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(item.isDeeplink).toBe(false);
    });

    it("should default isDeeplink to false if not provided", () => {
      const item: RecallItem = {
        id: 1,
        title: "Deicing procedure",
        description: "",
        phases: ["Preflight"],
        reference: "",
        // isDeeplink not provided, should be undefined
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(item.isDeeplink).toBeUndefined();
    });
  });
});
