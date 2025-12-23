import { useState } from "react";
import OnboardingModal from "./components/OnboardingModal";
import FlightListScreen from "./components/FlightListScreen";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    !(navigator as unknown as { standalone?: boolean }).standalone
  );

  return (
    <>
      <FlightListScreen />

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </>
  );
}
