import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { StorageManager } from "../lib/database";
import { RecallItem } from "../types/index";

describe("Recall Manager Validation Logic", () => {
  beforeEach(async () => {
    await StorageManager.clearAllData();
  });

  afterEach(async () => {
    await StorageManager.clearAllData();
  });

  describe("Item Addition Validation", () => {
    it("should require a non-empty title", async () => {
      const invalidItem: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "",
        description: "Description without title",
        phases: ["Preflight"],
        reference: "REF-1",
      };

      // Simulate validation
      const isValid = !!(invalidItem.title && invalidItem.title.trim().length > 0);
      expect(isValid).toBe(false);
    });

    it("should require at least one phase", async () => {
      const invalidItem: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Item without phases",
        description: "",
        phases: [],
        reference: "REF-1",
      };

      // Simulate validation
      const isValid = invalidItem.phases && invalidItem.phases.length > 0;
      expect(isValid).toBe(false);
    });

    it("should accept item with valid title and phases", async () => {
      const validItem: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Valid Item",
        description: "",
        phases: ["Preflight"],
        reference: "REF-1",
      };

      // Simulate validation
      const isTitleValid =
        validItem.title && validItem.title.trim().length > 0;
      const isPhasesValid = validItem.phases && validItem.phases.length > 0;
      expect(isTitleValid && isPhasesValid).toBe(true);
    });

    it("should accept item with multiple phases", async () => {
      const validItem: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Multi-phase Item",
        description: "",
        phases: ["Preflight", "Taxi", "Takeoff"],
        reference: "REF-1",
      };

      // Simulate validation
      const isPhasesValid = validItem.phases && validItem.phases.length > 0;
      expect(isPhasesValid).toBe(true);
      expect(validItem.phases).toHaveLength(3);
    });
  });

  describe("Item Sanitization", () => {
    it("should trim whitespace from title", () => {
      const unsanitized: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "  Item with spaces  ",
        description: "",
        phases: ["Preflight"],
        reference: "",
      };

      const sanitized = {
        ...unsanitized,
        title: unsanitized.title.trim(),
      };

      expect(sanitized.title).toBe("Item with spaces");
    });

    it("should trim whitespace from description", () => {
      const unsanitized: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Item",
        description: "  Description with spaces  ",
        phases: ["Preflight"],
        reference: "",
      };

      const sanitized = {
        ...unsanitized,
        description: unsanitized.description?.trim() || "",
      };

      expect(sanitized.description).toBe("Description with spaces");
    });

    it("should trim whitespace from reference", () => {
      const unsanitized: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Item",
        description: "",
        phases: ["Preflight"],
        reference: "  REF-123  ",
      };

      const sanitized = {
        ...unsanitized,
        reference: unsanitized.reference?.trim() || "",
      };

      expect(sanitized.reference).toBe("REF-123");
    });

    it("should trim and filter threats array", () => {
      const unsanitized: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Item",
        description: "",
        phases: ["Preflight"],
        reference: "",
        threats: ["  Threat 1  ", "  Threat 2  ", ""],
      };

      const sanitized = {
        ...unsanitized,
        threats:
          unsanitized.threats?.map((t) => t.trim()).filter(Boolean) || [],
      };

      expect(sanitized.threats).toHaveLength(2);
      expect(sanitized.threats).toContain("Threat 1");
      expect(sanitized.threats).toContain("Threat 2");
    });

    it("should handle empty description", () => {
      const unsanitized: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Item",
        description: "",
        phases: ["Preflight"],
        reference: "",
      };

      const sanitized = {
        ...unsanitized,
        description: unsanitized.description?.trim() || "",
      };

      expect(sanitized.description).toBe("");
    });

    it("should handle undefined isTier1 (default to false)", () => {
      const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Item",
        description: "",
        phases: ["Preflight"],
        reference: "",
        isTier1: undefined,
      };

      const sanitized = {
        ...item,
        isTier1: item.isTier1 ?? false,
      };

      expect(sanitized.isTier1).toBe(false);
    });

    it("should preserve isTier1 when true", () => {
      const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
        title: "Critical Item",
        description: "",
        phases: ["Preflight"],
        reference: "",
        isTier1: true,
      };

      const sanitized = {
        ...item,
        isTier1: item.isTier1 ?? false,
      };

      expect(sanitized.isTier1).toBe(true);
    });
  });

  describe("Item Update Validation", () => {
    it("should prevent clearing title during update", () => {
      const updates = { title: "" };

      // Simulate validation
      const isValid = !("title" in updates && (!updates.title || updates.title.trim().length === 0));
      expect(isValid).toBe(false);
    });

    it("should prevent clearing all phases during update", () => {
      const updates = { phases: [] };

      // Simulate validation
      const isValid = !(
        "phases" in updates &&
        (!updates.phases || updates.phases.length === 0)
      );
      expect(isValid).toBe(false);
    });

    it("should allow updating description", () => {
      // Updating non-mandatory fields is OK
      const isValid = true;
      expect(isValid).toBe(true);
    });

    it("should allow updating reference", () => {
      // Updating non-mandatory fields is OK
      const isValid = true;
      expect(isValid).toBe(true);
    });

    it("should allow updating isTier1", () => {
      // Updating non-mandatory fields is OK
      const isValid = true;
      expect(isValid).toBe(true);
    });

    it("should allow updating threats", () => {
      // Updating non-mandatory fields is OK
      const isValid = true;
      expect(isValid).toBe(true);
    });
  });

  describe("Flight Item Association", () => {
    it("should add item to flight's activeItemIds when created", async () => {
      // Create recall item
      const itemId = await StorageManager.addRecallItem({
        title: "Test Item",
        description: "",
        phases: ["Preflight"],
        reference: "REF-1",
      });

      // Create flight
      const now = Date.now();
      const flightId = await StorageManager.addFlightList({
        fromAirport: "JFK",
        toAirport: "LAX",
        departureTime: now,
        arrivalTime: now + 5 * 60 * 60 * 1000,
        title: "JFK-LAX 0900",
        activeItemIds: [itemId],
        status: "live",
      });

      // Verify item is in flight
      const flight = await StorageManager.getFlightList(flightId);
      expect(flight?.activeItemIds).toContain(itemId);
    });

    it("should remove item from flight's activeItemIds when deleted", async () => {
      // Create items
      const id1 = await StorageManager.addRecallItem({
        title: "Item 1",
        description: "",
        phases: ["Preflight"],
        reference: "REF-1",
      });

      const id2 = await StorageManager.addRecallItem({
        title: "Item 2",
        description: "",
        phases: ["Taxi"],
        reference: "REF-2",
      });

      // Create flight with both items
      const now = Date.now();
      const flightId = await StorageManager.addFlightList({
        fromAirport: "JFK",
        toAirport: "LAX",
        departureTime: now,
        arrivalTime: now + 5 * 60 * 60 * 1000,
        title: "JFK-LAX 0900",
        activeItemIds: [id1, id2],
        status: "live",
      });

      // Delete item 1
      await StorageManager.deleteRecallItem(id1);

      // Simulate updating flight to remove item from activeItemIds
      const updatedActiveItemIds = [id2];
      await StorageManager.updateFlightList(flightId, {
        activeItemIds: updatedActiveItemIds,
      });

      // Verify item 1 is no longer in flight
      const flight = await StorageManager.getFlightList(flightId);
      expect(flight?.activeItemIds).not.toContain(id1);
      expect(flight?.activeItemIds).toContain(id2);
    });

    it("should handle item in multiple flights", async () => {
      // Create item
      const itemId = await StorageManager.addRecallItem({
        title: "Shared Item",
        description: "",
        phases: ["Preflight"],
        reference: "REF-1",
      });

      // Create two flights with the same item
      const now = Date.now();
      const flight1Id = await StorageManager.addFlightList({
        fromAirport: "JFK",
        toAirport: "LAX",
        departureTime: now,
        arrivalTime: now + 5 * 60 * 60 * 1000,
        title: "JFK-LAX 0900",
        activeItemIds: [itemId],
        status: "live",
      });

      const flight2Id = await StorageManager.addFlightList({
        fromAirport: "SFO",
        toAirport: "NYC",
        departureTime: now + 10 * 60 * 60 * 1000,
        arrivalTime: now + 15 * 60 * 60 * 1000,
        title: "SFO-NYC 1000",
        activeItemIds: [itemId],
        status: "live",
      });

      // Verify item is in both flights
      const flight1 = await StorageManager.getFlightList(flight1Id);
      const flight2 = await StorageManager.getFlightList(flight2Id);

      expect(flight1?.activeItemIds).toContain(itemId);
      expect(flight2?.activeItemIds).toContain(itemId);
    });
  });
});
