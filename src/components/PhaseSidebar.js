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
export default function PhaseSidebar({ currentPhase, isCriticalPhase }) {
    const { setCurrentPhase, setIsCriticalPhase } = useAppStore();
    const currentPhaseIndex = FLIGHT_PHASES.indexOf(currentPhase);
    const handlePrevPhase = () => {
        if (currentPhaseIndex > 0) {
            setCurrentPhase(FLIGHT_PHASES[currentPhaseIndex - 1]);
        }
    };
    const handleNextPhase = () => {
        if (currentPhaseIndex < FLIGHT_PHASES.length - 1) {
            setCurrentPhase(FLIGHT_PHASES[currentPhaseIndex + 1]);
        }
    };
    return (_jsxs("div", { className: "w-24 bg-gray-900 text-white flex flex-col safe-top safe-bottom", children: [_jsx("button", { onClick: () => setIsCriticalPhase(!isCriticalPhase), className: `px-2 py-3 text-xs font-bold transition-colors duration-150 border-b-2 ${isCriticalPhase
                    ? 'bg-red-700 border-red-900'
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`, children: isCriticalPhase ? '🚨 T1' : 'ALL' }), _jsx("div", { className: "flex-1 overflow-y-auto", children: FLIGHT_PHASES.map((phase, index) => {
                    const isActive = phase === currentPhase;
                    const isDisabledPrev = index < currentPhaseIndex;
                    return (_jsx("button", { onClick: () => setCurrentPhase(phase), className: `w-full px-2 py-3 text-xs font-semibold text-center transition-colors duration-100 border-l-2 ${isActive
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : isDisabledPrev
                                ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`, children: phase.length > 7 ? phase.slice(0, 6) : phase }, phase));
                }) }), _jsxs("div", { className: "border-t border-gray-700 p-2 space-y-2", children: [_jsx("button", { onClick: handlePrevPhase, disabled: currentPhaseIndex === 0, className: "w-full px-2 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs font-bold rounded transition-colors", children: "\u2191 PREV" }), _jsx("button", { onClick: handleNextPhase, disabled: currentPhaseIndex === FLIGHT_PHASES.length - 1, className: "w-full px-2 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs font-bold rounded transition-colors", children: "NEXT \u2193" })] })] }));
}
