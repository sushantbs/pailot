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
export default function PhaseIndicator({ currentPhase, isCriticalPhase, itemCount, }) {
    const { setCurrentPhase, setIsCriticalPhase } = useAppStore();
    return (_jsxs("div", { className: "phase-indicator safe-top", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-400 font-normal", children: "CURRENT" }), _jsx("div", { className: "text-2xl font-bold", children: currentPhase }), _jsxs("div", { className: "text-xs text-gray-400 mt-1", children: [itemCount, " item", itemCount !== 1 ? 's' : ''] })] }), _jsx("button", { onClick: () => setIsCriticalPhase(!isCriticalPhase), className: `px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-100 ${isCriticalPhase
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300'}`, children: isCriticalPhase ? '🚨 Tier-1 Only' : 'Show All' })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: FLIGHT_PHASES.map(phase => (_jsx("button", { onClick: () => setCurrentPhase(phase), className: `phase-toggle whitespace-nowrap ${currentPhase === phase
                        ? 'phase-toggle.active'
                        : 'phase-toggle.inactive'}`, children: phase }, phase))) })] }));
}
