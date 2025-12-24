import { useAppStore } from "../store/appStore";
import { FlightPhase } from "../types/index";

const FLIGHT_PHASES: FlightPhase[] = [
  "Preflight",
  "Taxi",
  "Takeoff",
  "Climb",
  "Cruise",
  "Descent",
  "Approach",
  "Landing",
  "Shutdown",
];

interface PhaseSidebarProps {
  currentPhase: FlightPhase;
  isCriticalPhase: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhaseSidebar({
  currentPhase,
  isCriticalPhase,
  isOpen,
  onClose,
}: PhaseSidebarProps) {
  const { setCurrentPhase, setIsCriticalPhase } = useAppStore();

  const currentPhaseIndex = FLIGHT_PHASES.indexOf(currentPhase);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40 transition-transform duration-300 safe-top safe-bottom ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold">Phases</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tier-1 Toggle */}
        <button
          onClick={() => setIsCriticalPhase(!isCriticalPhase)}
          className={`px-4 py-3 text-sm font-bold transition-colors duration-150 border-b-2 ${
            isCriticalPhase
              ? "bg-red-700 border-red-900"
              : "bg-gray-800 border-gray-700 hover:bg-gray-700"
          }`}
        >
          {isCriticalPhase ? "🚨 TIER-1" : "ALL PHASES"}
        </button>

        {/* Phases List */}
        <div className="flex-1 overflow-y-auto">
          {FLIGHT_PHASES.map((phase, index) => {
            const isActive = phase === currentPhase;
            const isDisabledPrev = index < currentPhaseIndex;

            return (
              <button
                key={phase}
                onClick={() => {
                  setCurrentPhase(phase);
                  onClose();
                }}
                className={`w-full px-4 py-3 text-sm font-semibold text-left transition-colors duration-100 border-l-4 ${
                  isActive
                    ? "bg-blue-600 border-blue-400 text-white"
                    : isDisabledPrev
                    ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {phase}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
