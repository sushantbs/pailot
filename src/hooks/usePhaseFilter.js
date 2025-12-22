import { useMemo } from 'react';
/**
 * filterItemsByPhase: Pure function that filters recall items deterministically
 * This can be tested without React hooks
 */
export function filterItemsByPhase(currentPhase, allItems, isCriticalPhase) {
    // Phase 1: Filter items that contain the current phase
    const phaseFilteredItems = allItems.filter(item => item.phases.includes(currentPhase));
    // Phase 2: If this is a critical phase, filter to show only Tier-1 items
    if (isCriticalPhase) {
        return phaseFilteredItems.filter(item => item.isTier1 === true);
    }
    return phaseFilteredItems;
}
/**
 * usePhaseFilter: React hook for deterministic filtering engine
 * Goal: Zero latency phase transitions with Tier-1 critical phase support
 */
export function usePhaseFilter(currentPhase, allItems, isCriticalPhase) {
    return useMemo(() => {
        return filterItemsByPhase(currentPhase, allItems, isCriticalPhase);
    }, [currentPhase, allItems, isCriticalPhase]);
}
