import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../store/appStore';
const FLIGHT_PHASES = [
    'Preflight',
    'Taxi',
    'Takeoff',
    'Climb',
    'Cruise',
    'Descent',
    'Approach',
    'Landing',
    'Shutdown',
];
export default function PhaseSidebar({ currentPhase, isCriticalPhase, onAddItemForPhase }) {
    const { setCurrentPhase, setIsCriticalPhase } = useAppStore();
    const currentPhaseIndex = FLIGHT_PHASES.indexOf(currentPhase);
    return (_jsxs("div", { className: "w-40 bg-gray-900 text-white flex flex-col safe-top safe-bottom", children: [_jsx("button", { onClick: () => setIsCriticalPhase(!isCriticalPhase), className: `px-3 py-3 text-sm font-bold transition-colors duration-150 border-b-2 ${isCriticalPhase
                    ? 'bg-red-700 border-red-900'
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`, children: isCriticalPhase ? '🚨 TIER-1' : 'ALL PHASES' }), _jsx("div", { className: "flex-1 overflow-y-auto", children: FLIGHT_PHASES.map((phase, index) => {
                    const isActive = phase === currentPhase;
                    const isDisabledPrev = index < currentPhaseIndex;
                    return (_jsxs("div", { children: [_jsx("button", { onClick: () => setCurrentPhase(phase), className: `w-full px-3 py-3 text-sm font-semibold text-left transition-colors duration-100 border-l-4 ${isActive
                                    ? 'bg-blue-600 border-blue-400 text-white'
                                    : isDisabledPrev
                                        ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`, children: phase }), isActive && (_jsx("button", { onClick: () => onAddItemForPhase?.(phase), className: "w-full px-3 py-2 text-xs font-semibold text-blue-300 hover:text-blue-200 bg-blue-900/30 border-l-4 border-blue-400 transition-colors", children: "+ New Item" }))] }, phase));
                }) })] }));
}
