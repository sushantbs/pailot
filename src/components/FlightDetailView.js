import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { usePhaseFilter } from '../hooks/usePhaseFilter';
import { StorageManager } from '../lib/database';
import PhaseSidebar from './PhaseSidebar';
import RecallCardList from './RecallCardList';
import CreateRecallModal from './CreateRecallModal';
export default function FlightDetailView({ flightId, onClose }) {
    const [flight, setFlight] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { currentPhase, isCriticalPhase, recallItems } = useAppStore();
    const filteredItems = usePhaseFilter(currentPhase, recallItems, isCriticalPhase);
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
    if (loading || !flight) {
        return (_jsx("div", { className: "fixed inset-0 bg-white flex items-center justify-center z-50", children: _jsx("div", { className: "text-center", children: _jsx("p", { className: "text-lg font-semibold text-gray-700", children: "Loading flight..." }) }) }));
    }
    const departureDate = new Date(flight.departureTime);
    const arrivalDate = new Date(flight.arrivalTime);
    return (_jsxs("div", { className: "fixed inset-0 bg-white flex z-50 safe-bottom", children: [_jsx(PhaseSidebar, { currentPhase: currentPhase, isCriticalPhase: isCriticalPhase }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "bg-gray-900 text-white px-4 py-4 border-b border-gray-800 safe-top", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h1", { className: "text-2xl font-bold", children: flight.title }), _jsx("button", { onClick: onClose, className: "text-2xl text-gray-400 hover:text-white font-light", children: "\u2715" })] }), _jsxs("div", { className: "text-sm text-gray-400", children: [_jsxs("p", { children: [departureDate.toLocaleDateString(), " ", departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), " \u2192", ' ', arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }), _jsxs("p", { children: [filteredItems.length, " item", filteredItems.length !== 1 ? 's' : '', " for ", _jsx("strong", { children: currentPhase })] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto bg-gray-50", children: _jsx(RecallCardList, { items: filteredItems }) }), _jsx("button", { onClick: () => setShowCreateModal(true), className: "m-4 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold hover:bg-blue-700 active:bg-blue-800 touch-target", children: "+ New Item" }), showCreateModal && (_jsx(CreateRecallModal, { onClose: () => setShowCreateModal(false) }))] })] }));
}
