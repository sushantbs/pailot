import Dexie, { Table } from "dexie";
import { RecallItem, FlightList } from "../types/index";

/**
 * PRA Database using Dexie.js (IndexedDB wrapper)
 * Handles offline-first persistence for recall items and flight lists
 */
export class PRADatabase extends Dexie {
  recallItems!: Table<RecallItem>;
  flightLists!: Table<FlightList>;

  constructor() {
    super("PilotRecallAssistant");
    this.version(1).stores({
      recallItems: "++id",
      flightLists: "++id, date",
    });
  }
}

export const db = new PRADatabase();

/**
 * StorageManager: Abstracts database operations and handles iOS persistence
 */
export class StorageManager {
  /**
   * Request persistent storage on iOS Safari to prevent data deletion after 7 days of inactivity
   */
  static async requestPersistentStorage(): Promise<boolean> {
    if (!navigator.storage?.persist) {
      console.warn("Persistent storage API not available");
      return false;
    }

    try {
      const isPersisted = await navigator.storage.persist();
      if (isPersisted) {
        console.warn("✓ Persistent storage granted");
      } else {
        console.warn(
          "⚠ Persistent storage not granted - data may be deleted after 7 days"
        );
      }
      return isPersisted;
    } catch (error) {
      console.error("Error requesting persistent storage:", error);
      return false;
    }
  }

  /**
   * Add a new recall item
   */
  static async addRecallItem(
    item: Omit<RecallItem, "id" | "createdAt" | "updatedAt">
  ): Promise<number> {
    const now = Date.now();
    const id = await db.recallItems.add({
      ...item,
      createdAt: now,
      updatedAt: now,
    } as RecallItem);
    return id as number;
  }

  /**
   * Get all recall items
   */
  static async getAllRecallItems(): Promise<RecallItem[]> {
    return db.recallItems.toArray();
  }

  /**
   * Get a recall item by ID
   */
  static async getRecallItem(id: number): Promise<RecallItem | undefined> {
    return db.recallItems.get(id);
  }

  /**
   * Update a recall item
   */
  static async updateRecallItem(
    id: number,
    updates: Partial<RecallItem>
  ): Promise<RecallItem | undefined> {
    await db.recallItems.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return db.recallItems.get(id);
  }

  /**
   * Delete a recall item
   */
  static async deleteRecallItem(id: number): Promise<void> {
    await db.recallItems.delete(id);
  }

  /**
   * Add a new flight list
   */
  static async addFlightList(
    list: Omit<FlightList, "id" | "createdAt" | "updatedAt">
  ): Promise<number> {
    const now = Date.now();
    const id = await db.flightLists.add({
      ...list,
      createdAt: now,
      updatedAt: now,
    } as FlightList);
    return id as number;
  }

  /**
   * Get all flight lists
   */
  static async getAllFlightLists(): Promise<FlightList[]> {
    return db.flightLists.toArray();
  }

  /**
   * Get a flight list by ID
   */
  static async getFlightList(id: number): Promise<FlightList | undefined> {
    return db.flightLists.get(id);
  }

  /**
   * Update a flight list
   */
  static async updateFlightList(
    id: number,
    updates: Partial<FlightList>
  ): Promise<FlightList | undefined> {
    await db.flightLists.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return db.flightLists.get(id);
  }

  /**
   * Delete a flight list
   */
  static async deleteFlightList(id: number): Promise<void> {
    await db.flightLists.delete(id);
  }

  /**
   * Get all items for a specific flight list
   */
  static async getFlightListItems(flightListId: number): Promise<RecallItem[]> {
    const flightList = await db.flightLists.get(flightListId);
    if (!flightList) return [];

    const allItems = await db.recallItems.toArray();
    return allItems.filter((item) =>
      flightList.activeItemIds.includes(item.id!)
    );
  }

  /**
   * Clear all data (useful for testing)
   */
  static async clearAllData(): Promise<void> {
    await db.recallItems.clear();
    await db.flightLists.clear();
  }
}
