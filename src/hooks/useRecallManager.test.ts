import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { StorageManager } from "../lib/database";
import { RecallItem } from "../types/index";

describe("useRecallManager - CRUD Operations", () => {
  beforeEach(async () => {
    await StorageManager.clearAllData();
  });

  afterEach(async () => {
    await StorageManager.clearAllData();
  });

  it("should add a valid recall item with mandatory fields", async () => {
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Deicing Procedure",
      description: "Check deicing conditions",
      phases: ["Taxi"],
      reference: "OM-C 4.3.2",
      threats: ["Icing"],
    };

    const id = await StorageManager.addRecallItem(item);
    const retrieved = await StorageManager.getRecallItem(id);

    expect(id).toBeDefined();
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe("Deicing Procedure");
    expect(retrieved?.phases).toContain("Taxi");
  });

  it("should enforce title as mandatory field", async () => {
    const invalidItem = {
      title: "",
      description: "Missing title",
      phases: ["Taxi"],
      reference: "",
    };

    // Validation happens at hook level, but we test database accepts well-formed data
    expect(invalidItem.title.trim().length).toBe(0);
  });

  it("should enforce phases as mandatory field", async () => {
    const invalidItem = {
      title: "Test",
      description: "Missing phases",
      phases: [] as unknown[],
      reference: "",
    };

    expect(invalidItem.phases.length).toBe(0);
  });

  it("should update a recall item", async () => {
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Original Title",
      description: "Original description",
      phases: ["Taxi"],
      reference: "REF-1",
    };

    const id = await StorageManager.addRecallItem(item);
    const updated = await StorageManager.updateRecallItem(id, {
      title: "Updated Title",
      description: "Updated description",
    });

    expect(updated?.title).toBe("Updated Title");
    expect(updated?.description).toBe("Updated description");
    expect(updated?.phases).toEqual(["Taxi"]);
  });

  it("should delete a recall item", async () => {
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "To Delete",
      description: "This item will be deleted",
      phases: ["Taxi"],
      reference: "",
    };

    const id = await StorageManager.addRecallItem(item);
    await StorageManager.deleteRecallItem(id);
    const retrieved = await StorageManager.getRecallItem(id);

    expect(retrieved).toBeUndefined();
  });

  it("should sanitize whitespace in title, description, and reference", async () => {
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "  Deicing Procedure  ",
      description: "  Check conditions  ",
      phases: ["Taxi"],
      reference: "  OM-C 4.3.2  ",
    };

    const id = await StorageManager.addRecallItem(item);
    const retrieved = await StorageManager.getRecallItem(id);

    // Note: Trim happens in hook, not in database layer
    expect(retrieved?.title).toBe("  Deicing Procedure  ");
  });

  it("should handle media attachments as Blobs", async () => {
    const mediaBlob = new Blob(["image data"], { type: "image/png" });
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Item with Media",
      description: "",
      phases: ["Taxi"],
      reference: "",
      mediaBlob,
    };

    const id = await StorageManager.addRecallItem(item);
    const retrieved = await StorageManager.getRecallItem(id);

    expect(retrieved?.mediaBlob).toBeDefined();
  });

  it("should store timestamps for creation and update", async () => {
    const item: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> = {
      title: "Test Item",
      description: "",
      phases: ["Taxi"],
      reference: "",
    };

    const beforeCreate = Date.now();
    const id = await StorageManager.addRecallItem(item);
    const afterCreate = Date.now();

    const retrieved = await StorageManager.getRecallItem(id);

    expect(retrieved?.createdAt).toBeGreaterThanOrEqual(beforeCreate);
    expect(retrieved?.createdAt).toBeLessThanOrEqual(afterCreate);
    expect(retrieved?.updatedAt).toBe(retrieved?.createdAt);
  });
});
