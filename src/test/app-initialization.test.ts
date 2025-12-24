import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { StorageManager } from "../lib/database";
import { useAppStore } from "../store/appStore";
import { RecallItem, FlightList } from "../types/index";

describe("App Initialization Logic", () => {
  beforeEach(async () => {
    await StorageManager.clearAllData();
    // Reset store to initial state
    useAppStore.setState({
      currentPhase: "Preflight",
      activeFlightListId: null,
      isCriticalPhase: false,
      recallItems: [],
      flightLists: [],
    });
  });

  afterEach(async () => {
    await StorageManager.clearAllData();
  });

  describe("AppBootstrap initialization", () => {
    it("should load all recall items from database on app mount", async () => {
      // Setup: Add recall items to database
      const items: Omit<RecallItem, "id" | "createdAt" | "updatedAt">[] = [
        {
          title: "Item 1",
          description: "First item",
          phases: ["Preflight"],
          reference: "REF-1",
        },
        {
          title: "Item 2",
          description: "Second item",
          phases: ["Taxi"],
          reference: "REF-2",
        },
      ];

      for (const item of items) {
        await StorageManager.addRecallItem(item);
      }

      // Simulate app initialization
      const loadedItems = await StorageManager.getAllRecallItems();
      useAppStore.getState().setRecallItems(loadedItems);

      // Assert: All items loaded into store
      const storeItems = useAppStore.getState().recallItems;
      expect(storeItems).toHaveLength(2);
      expect(storeItems.map((i) => i.title)).toContain("Item 1");
      expect(storeItems.map((i) => i.title)).toContain("Item 2");
    });

    it("should load all flight lists from database on app mount", async () => {
      // Setup: Add flight lists to database
      const now = Date.now();
      const lists = [
        {
          fromAirport: "JFK",
          toAirport: "LAX",
          departureTime: now,
          arrivalTime: now + 5 * 60 * 60 * 1000,
          title: "JFK-LAX 0900",
          activeItemIds: [],
          status: "live" as const,
        },
        {
          fromAirport: "SFO",
          toAirport: "NYC",
          departureTime: now + 10 * 60 * 60 * 1000,
          arrivalTime: now + 15 * 60 * 60 * 1000,
          title: "SFO-NYC 1000",
          activeItemIds: [],
          status: "live" as const,
        },
      ];

      for (const list of lists) {
        await StorageManager.addFlightList(list);
      }

      // Simulate app initialization
      const loadedLists = await StorageManager.getAllFlightLists();
      useAppStore.getState().setFlightLists(loadedLists);

      // Assert: All flight lists loaded into store
      const storeFlights = useAppStore.getState().flightLists;
      expect(storeFlights).toHaveLength(2);
      expect(storeFlights.map((f) => f.title)).toContain("JFK-LAX 0900");
      expect(storeFlights.map((f) => f.title)).toContain("SFO-NYC 1000");
    });

    it("should set first flight list as active if available on app mount", async () => {
      // Setup: Add multiple flight lists
      const now = Date.now();
      const lists = [
        {
          fromAirport: "JFK",
          toAirport: "LAX",
          departureTime: now,
          arrivalTime: now + 5 * 60 * 60 * 1000,
          title: "JFK-LAX 0900",
          activeItemIds: [],
          status: "live" as const,
        },
        {
          fromAirport: "SFO",
          toAirport: "NYC",
          departureTime: now + 10 * 60 * 60 * 1000,
          arrivalTime: now + 15 * 60 * 60 * 1000,
          title: "SFO-NYC 1000",
          activeItemIds: [],
          status: "live" as const,
        },
      ];

      const ids = [];
      for (const list of lists) {
        const id = await StorageManager.addFlightList(list);
        ids.push(id);
      }

      // Simulate app initialization
      const loadedLists = await StorageManager.getAllFlightLists();
      useAppStore.getState().setFlightLists(loadedLists);

      if (loadedLists.length > 0) {
        useAppStore.getState().setActiveFlightList(loadedLists[0].id || null);
      }

      // Assert: First flight list is set as active
      const activeFlightId = useAppStore.getState().activeFlightListId;
      expect(activeFlightId).toBe(ids[0]);
    });

    it("should handle empty database on app mount", async () => {
      // Simulate app initialization with no data
      const loadedItems = await StorageManager.getAllRecallItems();
      const loadedLists = await StorageManager.getAllFlightLists();

      useAppStore.getState().setRecallItems(loadedItems);
      useAppStore.getState().setFlightLists(loadedLists);

      // Assert: Store is initialized with empty arrays
      expect(useAppStore.getState().recallItems).toHaveLength(0);
      expect(useAppStore.getState().flightLists).toHaveLength(0);
      expect(useAppStore.getState().activeFlightListId).toBeNull();
    });

    it("should not set active flight when list is empty", async () => {
      // Simulate app initialization with no flights
      const loadedLists = await StorageManager.getAllFlightLists();
      useAppStore.getState().setFlightLists(loadedLists);

      if (loadedLists.length > 0) {
        useAppStore.getState().setActiveFlightList(loadedLists[0].id || null);
      }

      // Assert: No active flight is set
      expect(useAppStore.getState().activeFlightListId).toBeNull();
    });
  });

  describe("Flight list initialization with recall items", () => {
    it("should load recall items associated with the active flight", async () => {
      // Setup: Create recall items
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

      // Simulate loading flight items
      const flightItems = await StorageManager.getFlightListItems(flightId);

      // Assert: Both items are retrieved for the flight
      expect(flightItems).toHaveLength(2);
      expect(flightItems.map((i) => i.id)).toContain(id1);
      expect(flightItems.map((i) => i.id)).toContain(id2);
    });

    it("should handle flight with no recall items", async () => {
      // Create empty flight
      const now = Date.now();
      const flightId = await StorageManager.addFlightList({
        fromAirport: "JFK",
        toAirport: "LAX",
        departureTime: now,
        arrivalTime: now + 5 * 60 * 60 * 1000,
        title: "JFK-LAX 0900",
        activeItemIds: [],
        status: "live",
      });

      // Load flight items
      const flightItems = await StorageManager.getFlightListItems(flightId);

      // Assert: No items for the flight
      expect(flightItems).toHaveLength(0);
    });
  });

  describe("App store initialization", () => {
    it("should initialize store with default phase", () => {
      const state = useAppStore.getState();
      expect(state.currentPhase).toBe("Preflight");
    });

    it("should initialize store with no active flight", () => {
      const state = useAppStore.getState();
      expect(state.activeFlightListId).toBeNull();
    });

    it("should initialize store with critical phase disabled", () => {
      const state = useAppStore.getState();
      expect(state.isCriticalPhase).toBe(false);
    });

    it("should initialize store with empty recall items array", () => {
      const state = useAppStore.getState();
      expect(state.recallItems).toEqual([]);
    });

    it("should initialize store with empty flight lists array", () => {
      const state = useAppStore.getState();
      expect(state.flightLists).toEqual([]);
    });
  });

  describe("Store mutations", () => {
    it("should update current phase in store", () => {
      useAppStore.getState().setCurrentPhase("Taxi");
      expect(useAppStore.getState().currentPhase).toBe("Taxi");
    });

    it("should update active flight list in store", () => {
      useAppStore.getState().setActiveFlightList(42);
      expect(useAppStore.getState().activeFlightListId).toBe(42);
    });

    it("should update critical phase toggle in store", () => {
      useAppStore.getState().setIsCriticalPhase(true);
      expect(useAppStore.getState().isCriticalPhase).toBe(true);
    });

    it("should replace recall items in store", () => {
      const items: RecallItem[] = [
        {
          id: 1,
          title: "Item 1",
          description: "",
          phases: ["Preflight"],
          reference: "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      useAppStore.getState().setRecallItems(items);
      expect(useAppStore.getState().recallItems).toHaveLength(1);
      expect(useAppStore.getState().recallItems[0].title).toBe("Item 1");
    });

    it("should replace flight lists in store", () => {
      const now = Date.now();
      const lists: FlightList[] = [
        {
          id: 1,
          fromAirport: "JFK",
          toAirport: "LAX",
          departureTime: now,
          arrivalTime: now + 5 * 60 * 60 * 1000,
          title: "JFK-LAX 0900",
          activeItemIds: [],
          status: "live",
          createdAt: now,
          updatedAt: now,
        },
      ];
      useAppStore.getState().setFlightLists(lists);
      expect(useAppStore.getState().flightLists).toHaveLength(1);
      expect(useAppStore.getState().flightLists[0].title).toBe("JFK-LAX 0900");
    });

    it("should add recall item to store", () => {
      const item: RecallItem = {
        id: 1,
        title: "New Item",
        description: "",
        phases: ["Preflight"],
        reference: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      useAppStore.getState().addRecallItem(item);
      expect(useAppStore.getState().recallItems).toHaveLength(1);
      expect(useAppStore.getState().recallItems[0].title).toBe("New Item");
    });

    it("should remove recall item from store", () => {
      const item: RecallItem = {
        id: 1,
        title: "Item to Remove",
        description: "",
        phases: ["Preflight"],
        reference: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      useAppStore.getState().addRecallItem(item);
      expect(useAppStore.getState().recallItems).toHaveLength(1);

      useAppStore.getState().removeRecallItem(1);
      expect(useAppStore.getState().recallItems).toHaveLength(0);
    });

    it("should update recall item in store", () => {
      const item: RecallItem = {
        id: 1,
        title: "Original Title",
        description: "",
        phases: ["Preflight"],
        reference: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      useAppStore.getState().addRecallItem(item);

      useAppStore
        .getState()
        .updateRecallItem(1, { title: "Updated Title" });
      expect(useAppStore.getState().recallItems[0].title).toBe("Updated Title");
    });
  });
});
