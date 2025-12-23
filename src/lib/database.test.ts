import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { StorageManager } from "../lib/database";
import { RecallItem } from "../types/index";

describe("Flight Lifecycle Integration Tests", () => {
  beforeEach(async () => {
    await StorageManager.clearAllData();
  });

  afterEach(async () => {
    await StorageManager.clearAllData();
  });

  it("should complete full flight lifecycle: Taxi → Approach transition", async () => {
    // Setup: Seed the DB with test items
    const weatherCold: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Weather: Cold",
      description: "Icing conditions present",
      phases: ["Taxi"],
      reference: "OM-B 2.1.0",
      isTier1: false,
    };

    const terrainHigh: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Terrain: High",
      description: "High altitude approach",
      phases: ["Approach"],
      reference: "OM-C 7.0.0",
      isTier1: true,
    };

    await StorageManager.addRecallItem(weatherCold);
    await StorageManager.addRecallItem(terrainHigh);

    // Action 1: User sets phase to Taxi
    const taxiItems = (await StorageManager.getAllRecallItems()).filter(
      (item) => item.phases.includes("Taxi")
    );

    // Assert 1: Only 'Weather: Cold' is visible
    expect(taxiItems).toHaveLength(1);
    expect(taxiItems[0].title).toBe("Weather: Cold");

    // Action 2: User changes phase to Approach
    const approachItems = (await StorageManager.getAllRecallItems()).filter(
      (item) => item.phases.includes("Approach")
    );

    // Assert 2: 'Weather: Cold' is removed, 'Terrain: High' is added
    expect(approachItems).toHaveLength(1);
    expect(approachItems[0].title).toBe("Terrain: High");
    expect(approachItems.map((i) => i.title)).not.toContain("Weather: Cold");
  });

  it("should verify data persists across simulate page reload", async () => {
    // Create a recall item
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Persistence Test Item",
      description: "This item should survive reload",
      phases: ["Taxi"],
      reference: "TEST-1",
    };

    const id = await StorageManager.addRecallItem(item);

    // Simulate reload by querying the database again (in real app, this happens on mount)
    const reloadedItems = await StorageManager.getAllRecallItems();

    // Assert: Item is still present
    expect(reloadedItems).toHaveLength(1);
    expect(reloadedItems[0].id).toBe(id);
    expect(reloadedItems[0].title).toBe("Persistence Test Item");
  });

  it("should ensure no network requests during offline-first flow", async () => {
    // Mock fetch to ensure it's never called
    let fetchCalled = false;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response();
    };

    try {
      // Execute entire flow with storage operations only
      const items: Omit<RecallItem, "id" | "createdAt" | "updatedAt">[] = [
        {
          title: "Item 1",
          description: "Offline item",
          phases: ["Taxi"],
          reference: "REF-1",
        },
        {
          title: "Item 2",
          description: "Another offline item",
          phases: ["Takeoff"],
          reference: "REF-2",
        },
      ];

      for (const item of items) {
        await StorageManager.addRecallItem(item);
      }

      const allItems = await StorageManager.getAllRecallItems();
      const filtered = allItems.filter((i) => i.phases.includes("Taxi"));

      // Assert: All operations completed without network
      expect(fetchCalled).toBe(false);
      expect(allItems).toHaveLength(2);
      expect(filtered).toHaveLength(1);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("should handle flight list management", async () => {
    // Create recall items
    const id1 = await StorageManager.addRecallItem({
      title: "Item 1",
      description: "",
      phases: ["Taxi"],
      reference: "REF-1",
    });

    const id2 = await StorageManager.addRecallItem({
      title: "Item 2",
      description: "",
      phases: ["Takeoff"],
      reference: "REF-2",
    });

    // Create a flight list
    const now = Date.now();
    const flightListId = await StorageManager.addFlightList({
      fromAirport: "JFK",
      toAirport: "LAX",
      departureTime: now,
      arrivalTime: now + 5 * 60 * 60 * 1000,
      title: "JFK-LAX 0900",
      activeItemIds: [id1, id2],
      notes: "Test Flight",
    });

    // Retrieve flight list
    const flightList = await StorageManager.getFlightList(flightListId);

    expect(flightList).toBeDefined();
    expect(flightList?.activeItemIds).toEqual([id1, id2]);
    expect(flightList?.notes).toBe("Test Flight");
  });

  it("should get all items for a specific flight list", async () => {
    // Create items
    const id1 = await StorageManager.addRecallItem({
      title: "In List",
      description: "",
      phases: ["Taxi"],
      reference: "",
    });

    await StorageManager.addRecallItem({
      title: "Not In List",
      description: "",
      phases: ["Taxi"],
      reference: "",
    });

    // Create flight list with only first item
    const now = Date.now();
    const flightListId = await StorageManager.addFlightList({
      fromAirport: "SFO",
      toAirport: "SJC",
      departureTime: now,
      arrivalTime: now + 1 * 60 * 60 * 1000,
      title: "SFO-SJC 1000",
      activeItemIds: [id1],
    });

    // Get items for flight list
    const listItems = await StorageManager.getFlightListItems(flightListId);

    expect(listItems).toHaveLength(1);
    expect(listItems[0].title).toBe("In List");
  });

  it("should update flight list and track changes", async () => {
    const id1 = await StorageManager.addRecallItem({
      title: "Item 1",
      description: "",
      phases: ["Taxi"],
      reference: "",
    });

    const now = Date.now();
    const flightListId = await StorageManager.addFlightList({
      fromAirport: "ORD",
      toAirport: "MIA",
      departureTime: now,
      arrivalTime: now + 3 * 60 * 60 * 1000,
      title: "ORD-MIA 1200",
      activeItemIds: [id1],
      notes: "Original",
    });

    // Wait a bit to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Update flight list
    const updated = await StorageManager.updateFlightList(flightListId, {
      notes: "Updated Notes",
      activeItemIds: [],
    });

    expect(updated?.notes).toBe("Updated Notes");
    expect(updated?.updatedAt).toBeGreaterThanOrEqual(updated?.createdAt || 0);
  });
});
