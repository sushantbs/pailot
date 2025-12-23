import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { usePhaseFilter } from '../hooks/usePhaseFilter';
import { StorageManager } from '../lib/database';
import PhaseSidebar from './PhaseSidebar';
import RecallCardList from './RecallCardList';
import CreateRecallModal from './CreateRecallModal';
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
export default function FlightDetailView({ flightId, onClose }) {
    const [flight, setFlight] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { currentPhase, isCriticalPhase, recallItems, setCurrentPhase } = useAppStore();
    const filteredItems = usePhaseFilter(currentPhase, recallItems, isCriticalPhase);
    const currentPhaseIndex = FLIGHT_PHASES.indexOf(currentPhase);
    useEffect(() => {
        const loadFlight = async () => {
            const flightData = await StorageManager.getFlightList(flightId);
            if (flightData) {
                setFlight(flightData);
                // Load recall items for this flight
                const items = await StorageManager.getFlightListItems(flightId);
                useAppStore.getState().setRecallItems(items);
            }
            setLoading(false);
        };
        loadFlight();
    }, [flightId]);
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
    const handleAddItemForPhase = (phase) => {
        setCurrentPhase(phase);
        setShowCreateModal(true);
    };
    if (loading || !flight) {
        return (_jsx("div", { className: "fixed inset-0 bg-white flex items-center justify-center z-50", children: _jsx("div", { className: "text-center", children: _jsx("p", { className: "text-lg font-semibold text-gray-700", children: "Loading flight..." }) }) }));
    }
    const departureDate = new Date(flight.departureTime);
    const arrivalDate = new Date(flight.arrivalTime);
    return (_jsxs("div", { className: "fixed inset-0 bg-white flex z-50 safe-bottom", children: [_jsx(PhaseSidebar, { currentPhase: currentPhase, isCriticalPhase: isCriticalPhase, onAddItemForPhase: handleAddItemForPhase }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "bg-gray-900 text-white px-4 py-4 border-b border-gray-800 safe-top", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h1", { className: "text-2xl font-bold", children: flight.title }), _jsx("button", { onClick: onClose, className: "text-2xl text-gray-400 hover:text-white font-light", children: "\u2715" })] }), _jsxs("div", { className: "text-sm text-gray-400", children: [_jsxs("p", { children: [departureDate.toLocaleDateString(), " ", departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), " \u2192", ' ', arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }), _jsxs("p", { children: [filteredItems.length, " item", filteredItems.length !== 1 ? 's' : '', " for ", _jsx("strong", { children: currentPhase })] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto bg-gray-50", children: _jsx(RecallCardList, { items: filteredItems }) }), showCreateModal && (_jsx(CreateRecallModal, { onClose: () => setShowCreateModal(false) }))] }), _jsxs("div", { className: "fixed bottom-safe-bottom right-4 flex flex-col gap-2 z-40 mb-4", children: [_jsx("button", { onClick: handlePrevPhase, disabled: currentPhaseIndex === 0, className: "w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xl shadow-lg transition-colors flex items-center justify-center", title: "Previous phase", children: "\u2191" }), _jsx("button", { onClick: handleNextPhase, disabled: currentPhaseIndex === FLIGHT_PHASES.length - 1, className: "w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xl shadow-lg transition-colors flex items-center justify-center", title: "Next phase", children: "\u2193" })] })] }));
}
