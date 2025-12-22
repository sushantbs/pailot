import { create } from 'zustand'
import { FlightPhase, FlightState, RecallItem, FlightList } from '../types/index'

interface AppStore extends FlightState {
  recallItems: RecallItem[]
  flightLists: FlightList[]
  setCurrentPhase: (phase: FlightPhase) => void
  setIsCriticalPhase: (critical: boolean) => void
  setActiveFlightList: (id: number | null) => void
  setRecallItems: (items: RecallItem[]) => void
  setFlightLists: (lists: FlightList[]) => void
  addRecallItem: (item: RecallItem) => void
  removeRecallItem: (id: number) => void
  updateRecallItem: (id: number, updates: Partial<RecallItem>) => void
}

const initialState: FlightState = {
  currentPhase: 'Preflight',
  activeFlightListId: null,
  isCriticalPhase: false,
}

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  recallItems: [],
  flightLists: [],

  setCurrentPhase: (phase: FlightPhase) =>
    set({ currentPhase: phase }),

  setIsCriticalPhase: (critical: boolean) =>
    set({ isCriticalPhase: critical }),

  setActiveFlightList: (id: number | null) =>
    set({ activeFlightListId: id }),

  setRecallItems: (items: RecallItem[]) =>
    set({ recallItems: items }),

  setFlightLists: (lists: FlightList[]) =>
    set({ flightLists: lists }),

  addRecallItem: (item: RecallItem) =>
    set((state) => ({
      recallItems: [...state.recallItems, item],
    })),

  removeRecallItem: (id: number) =>
    set((state) => ({
      recallItems: state.recallItems.filter(item => item.id !== id),
    })),

  updateRecallItem: (id: number, updates: Partial<RecallItem>) =>
    set((state) => ({
      recallItems: state.recallItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
}))
