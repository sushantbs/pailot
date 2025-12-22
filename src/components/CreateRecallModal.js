import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRecallManager } from '../hooks/useRecallManager';
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
export default function CreateRecallModal({ onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reference, setReference] = useState('');
    const [selectedPhases, setSelectedPhases] = useState([]);
    const [threats, setThreats] = useState('');
    const [isTier1, setIsTier1] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);
    const { addRecallItem, error, loading } = useRecallManager();
    const handlePhaseToggle = (phase) => {
        setSelectedPhases(prev => prev.includes(phase)
            ? prev.filter(p => p !== phase)
            : [...prev, phase]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const threatsArray = threats
                .split('\n')
                .map(t => t.trim())
                .filter(Boolean);
            let mediaBlob;
            if (mediaFile) {
                mediaBlob = new Blob([mediaFile], { type: mediaFile.type });
            }
            await addRecallItem({
                title,
                description,
                reference,
                phases: selectedPhases,
                threats: threatsArray,
                isTier1,
                mediaBlob,
            });
            // Reset form and close
            setTitle('');
            setDescription('');
            setReference('');
            setSelectedPhases([]);
            setThreats('');
            setIsTier1(false);
            setMediaFile(null);
            onClose();
        }
        catch (err) {
            // Error is handled by the hook
            console.error(err);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end safe-bottom", children: _jsxs("div", { className: "w-full bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "New Recall Item" }), _jsx("button", { onClick: onClose, className: "text-2xl text-gray-500 font-light", children: "\u2715" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Title *" }), _jsx("input", { type: "text", value: title, onChange: e => setTitle(e.target.value), placeholder: "e.g., Deicing Procedure", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Description" }), _jsx("textarea", { value: description, onChange: e => setDescription(e.target.value), placeholder: "Additional context for this recall item", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base h-24 resize-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold mb-3", children: ["Flight Phases * (", selectedPhases.length, " selected)"] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: FLIGHT_PHASES.map(phase => (_jsx("button", { type: "button", onClick: () => handlePhaseToggle(phase), className: `px-4 py-3 rounded-lg font-semibold transition-colors duration-100 touch-target ${selectedPhases.includes(phase)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700'}`, children: phase }, phase))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Reference Pointer" }), _jsx("input", { type: "text", value: reference, onChange: e => setReference(e.target.value), placeholder: "e.g., OM-C 4.3.2", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Threats (one per line)" }), _jsx("textarea", { value: threats, onChange: e => setThreats(e.target.value), placeholder: "Icing conditions\nFuel calculations", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base h-20 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Media (Image/PDF)" }), _jsx("input", { type: "file", accept: "image/*,.pdf", onChange: e => setMediaFile(e.target.files?.[0] || null), className: "w-full px-4 py-3 border border-gray-300 rounded-lg text-base" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", id: "tier1", checked: isTier1, onChange: e => setIsTier1(e.target.checked), className: "w-5 h-5 rounded" }), _jsx("label", { htmlFor: "tier1", className: "font-semibold text-gray-700", children: "Mark as Tier-1 (Critical)" })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 touch-target", children: "Cancel" }), _jsx("button", { type: "submit", disabled: loading, className: "flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 touch-target", children: loading ? 'Saving...' : 'Create Item' })] })] })] }) }));
}
