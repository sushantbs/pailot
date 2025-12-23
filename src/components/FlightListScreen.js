import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import FlightCreationModal from './FlightCreationModal';
import FlightDetailView from './FlightDetailView';
export default function FlightListScreen() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const { flightLists } = useAppStore();
    const formatFlightTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
    const getFlightDuration = (departure, arrival) => {
        const hours = Math.floor((arrival - departure) / (1000 * 60 * 60));
        const minutes = Math.floor(((arrival - departure) % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };
    if (selectedFlightId) {
        return (_jsx(FlightDetailView, { flightId: selectedFlightId, onClose: () => setSelectedFlightId(null) }));
    }
    return (_jsxs("div", { className: "h-screen bg-gray-50 flex flex-col safe-top safe-bottom", children: [_jsxs("div", { className: "bg-gray-900 text-white px-4 py-6 border-b border-gray-800", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Flights" }), _jsxs("p", { className: "text-gray-400 text-sm mt-1", children: [flightLists.length, " flight", flightLists.length !== 1 ? 's' : ''] })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4", children: flightLists.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-center text-gray-500", children: _jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold mb-2", children: "No flights yet" }), _jsx("p", { className: "text-sm", children: "Create a new flight to get started" })] }) })) : (_jsx("div", { className: "space-y-3", children: [...flightLists]
                        .sort((a, b) => b.departureTime - a.departureTime)
                        .map((flight) => (_jsxs("button", { onClick: () => setSelectedFlightId(flight.id), className: "w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: flight.title }), _jsxs("span", { className: "text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded", children: [flight.activeItemIds.length, " items"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Depart" }), _jsx("p", { className: "font-semibold text-gray-900", children: formatFlightTime(flight.departureTime) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Arrive" }), _jsx("p", { className: "font-semibold text-gray-900", children: formatFlightTime(flight.arrivalTime) })] })] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Duration: ", getFlightDuration(flight.departureTime, flight.arrivalTime)] })] }, flight.id))) })) }), _jsx("div", { className: "p-4 border-t border-gray-200 bg-white", children: _jsx("button", { onClick: () => setShowCreateModal(true), className: "w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow-lg font-semibold hover:bg-blue-700 active:bg-blue-800 text-lg", children: "+ New Flight" }) }), showCreateModal && (_jsx(FlightCreationModal, { onClose: () => setShowCreateModal(false), onFlightCreated: (flightId) => {
                    setShowCreateModal(false);
                    setSelectedFlightId(flightId);
                } }))] }));
}
