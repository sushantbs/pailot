import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import RecallCard from './RecallCard';
export default function RecallCardList({ items }) {
    return (_jsx("div", { className: "flex-1 overflow-y-auto px-4 pt-4", children: items.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-center text-gray-500", children: _jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold mb-2", children: "No items for this phase" }), _jsx("p", { className: "text-sm", children: "Create a new recall item or change the flight phase" })] }) })) : (_jsx("div", { className: "space-y-3 pb-20", children: items.map(item => (_jsx("div", { className: "recall-item-enter", children: _jsx(RecallCard, { item: item }) }, item.id))) })) }));
}
