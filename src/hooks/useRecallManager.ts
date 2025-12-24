import { useState, useCallback } from "react";
import { RecallItem } from "../types/index";
import { StorageManager } from "../lib/database";
import { useAppStore } from "../store/appStore";

/**
 * useRecallManager: CRUD hook for managing recall items
 * Enforces validation and prevents auto-inject of data
 */
export function useRecallManager() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addRecallItem: (
    item: Omit<RecallItem, "id" | "createdAt" | "updatedAt">
  ) => void = useCallback(async (item) => {
    setLoading(true);
    setError(null);

    try {
      // Validation: Title is mandatory
      if (!item.title || item.title.trim().length === 0) {
        throw new Error("Title is required");
      }

      // Validation: At least one phase is mandatory
      if (!item.phases || item.phases.length === 0) {
        throw new Error("At least one flight phase must be selected");
      }

      // Sanitization: Ensure no smart auto-complete logic injects data
      const sanitizedItem: Omit<RecallItem, "id" | "createdAt" | "updatedAt"> =
        {
          title: item.title.trim(),
          description: item.description?.trim() || "",
          phases: item.phases,
          reference: item.reference?.trim() || "",
          mediaBlob: item.mediaBlob,
          threats: item.threats?.map((t) => t.trim()).filter(Boolean) || [],
          isTier1: item.isTier1 ?? false,
          isDeeplink: item.isDeeplink ?? false,
        };

      const id = await StorageManager.addRecallItem(sanitizedItem);
      const storedItem = await StorageManager.getRecallItem(id);

      if (storedItem) {
        useAppStore.getState().addRecallItem(storedItem);

        // Add item to the current flight's activeItemIds
        const state = useAppStore.getState();
        if (state.activeFlightListId) {
          const flight = await StorageManager.getFlightList(
            state.activeFlightListId
          );
          if (flight) {
            const updatedActiveItemIds = [...flight.activeItemIds, id];
            await StorageManager.updateFlightList(state.activeFlightListId, {
              activeItemIds: updatedActiveItemIds,
            });
          }
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add recall item";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecallItem = useCallback(
    async (id: number, updates: Partial<RecallItem>) => {
      setLoading(true);
      setError(null);

      try {
        // Prevent clearing mandatory fields
        if (
          "title" in updates &&
          (!updates.title || updates.title.trim().length === 0)
        ) {
          throw new Error("Title cannot be empty");
        }

        if (
          "phases" in updates &&
          (!updates.phases || updates.phases.length === 0)
        ) {
          throw new Error("At least one flight phase must be selected");
        }

        const sanitizedUpdates: Partial<RecallItem> = {
          ...updates,
          title: updates.title ? updates.title.trim() : undefined,
          description: updates.description
            ? updates.description.trim()
            : undefined,
          reference: updates.reference ? updates.reference.trim() : undefined,
        };

        const updated = await StorageManager.updateRecallItem(
          id,
          sanitizedUpdates
        );
        if (updated) {
          useAppStore.getState().updateRecallItem(id, updated);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update recall item";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteRecallItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await StorageManager.deleteRecallItem(id);
      useAppStore.getState().removeRecallItem(id);

      // Remove item from the current flight's activeItemIds
      const state = useAppStore.getState();
      if (state.activeFlightListId) {
        const flight = await StorageManager.getFlightList(
          state.activeFlightListId
        );
        if (flight) {
          const updatedActiveItemIds = flight.activeItemIds.filter(
            (itemId) => itemId !== id
          );
          await StorageManager.updateFlightList(state.activeFlightListId, {
            activeItemIds: updatedActiveItemIds,
          });
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete recall item";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addRecallItem,
    updateRecallItem,
    deleteRecallItem,
    error,
    loading,
  };
}
