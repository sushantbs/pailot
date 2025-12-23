import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import OnboardingModal from "./components/OnboardingModal";
import FlightListScreen from "./components/FlightListScreen";
export default function App() {
    const [showOnboarding, setShowOnboarding] = useState(!navigator.standalone);
    return (_jsxs(_Fragment, { children: [_jsx(FlightListScreen, {}), showOnboarding && (_jsx(OnboardingModal, { onClose: () => setShowOnboarding(false) }))] }));
}
