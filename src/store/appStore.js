import { create } from 'zustand';
const initialState = {
    currentPhase: 'Preflight',
    activeFlightListId: null,
    isCriticalPhase: false,
};
export const useAppStore = create((set) => ({
    ...initialState,
    recallItems: [],
    flightLists: [],
    setCurrentPhase: (phase) => set({ currentPhase: phase }),
    setIsCriticalPhase: (critical) => set({ isCriticalPhase: critical }),
    setActiveFlightList: (id) => set({ activeFlightListId: id }),
    setRecallItems: (items) => set({ recallItems: items }),
    setFlightLists: (lists) => set({ flightLists: lists }),
    addRecallItem: (item) => set((state) => ({
        recallItems: [...state.recallItems, item],
    })),
    removeRecallItem: (id) => set((state) => ({
        recallItems: state.recallItems.filter(item => item.id !== id),
    })),
    updateRecallItem: (id, updates) => set((state) => ({
        recallItems: state.recallItems.map(item => item.id === id ? { ...item, ...updates } : item),
    })),
}));
