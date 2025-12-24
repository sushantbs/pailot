import { useState, useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { usePhaseFilter } from "../hooks/usePhaseFilter";
import { StorageManager } from "../lib/database";
import { FlightList, FlightPhase } from "../types/index";
import PhaseSidebar from "./PhaseSidebar";
import RecallCardList from "./RecallCardList";
import CreateRecallModal from "./CreateRecallModal";

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

interface FlightDetailViewProps {
  flightId: number;
  onClose: () => void;
}

export default function FlightDetailView({
  flightId,
  onClose,
}: FlightDetailViewProps) {
  const [flight, setFlight] = useState<FlightList | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPhaseDrawer, setShowPhaseDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    currentPhase,
    isCriticalPhase,
    recallItems,
    setCurrentPhase,
    setActiveFlightList,
    setFlightLists,
  } = useAppStore();
  const filteredItems = usePhaseFilter(
    currentPhase,
    recallItems,
    isCriticalPhase
  );

  const currentPhaseIndex = FLIGHT_PHASES.indexOf(currentPhase);

  useEffect(() => {
    const loadFlight = async () => {
      const flightData = await StorageManager.getFlightList(flightId);
      if (flightData) {
        setFlight(flightData);
        setActiveFlightList(flightId);

        // Load recall items for this flight
        const items = await StorageManager.getFlightListItems(flightId);
        useAppStore.getState().setRecallItems(items);
      }
      setLoading(false);
    };

    loadFlight();
  }, [flightId, setActiveFlightList]);

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

  const handleCompleteFlight = async () => {
    try {
      await StorageManager.updateFlightList(flightId, { status: "completed" });
      const updated = await StorageManager.getAllFlightLists();
      setFlightLists(updated);
      onClose();
    } catch (err) {
      console.error("Failed to complete flight:", err);
    }
  };

  const handleDeleteFlight = async () => {
    try {
      await StorageManager.deleteFlightList(flightId);
      const updated = await StorageManager.getAllFlightLists();
      setFlightLists(updated);
      onClose();
    } catch (err) {
      console.error("Failed to delete flight:", err);
    }
  };

  if (loading || !flight) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading flight...
          </p>
        </div>
      </div>
    );
  }

  const departureDate = new Date(flight.departureTime);
  const arrivalDate = new Date(flight.arrivalTime);

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50 safe-bottom">
      {/* Phase Drawer */}
      <PhaseSidebar
        currentPhase={currentPhase}
        isCriticalPhase={isCriticalPhase}
        isOpen={showPhaseDrawer}
        onClose={() => setShowPhaseDrawer(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="bg-gray-900 text-white px-4 py-6 border-b border-gray-800 safe-top">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex-1">{flight?.title}</h1>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-2xl text-white hover:text-gray-300 transition-colors"
                  title="Menu"
                >
                  ⋮
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-gray-800 text-white rounded-lg shadow-lg z-50 min-w-48 border border-gray-700">
                    {flight.status === "live" && (
                      <button
                        onClick={() => {
                          handleCompleteFlight();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-gray-700 border-b border-gray-700 text-sm transition-colors"
                      >
                        ✓ Mark as Complete
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-700 text-red-400 text-sm transition-colors"
                    >
                      🗑 Delete Flight
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-2xl text-white hover:text-gray-300 font-light transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400 mb-4">
            <p>
              {departureDate.toLocaleDateString()}{" "}
              {departureDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              →{" "}
              {arrivalDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {/* Current Phase Display - Bigger */}
          <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <span>{currentPhase}</span>
            <span className="text-lg text-gray-400">
              ({filteredItems.length} item
              {filteredItems.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Burger Menu Button in Content */}
        <button
          onClick={() => setShowPhaseDrawer(true)}
          className="absolute top-6 left-4 z-30 text-2xl text-gray-600 hover:text-gray-900 transition-colors safe-top"
          title="Open phases"
        >
          ☰
        </button>

        {/* Recall Items */}
        <div className="flex-1">
          <RecallCardList items={filteredItems} />
        </div>

        {showCreateModal && (
          <CreateRecallModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>

      {/* Floating Navigation Buttons at Bottom Right */}
      <div className="fixed bottom-safe-bottom right-4 flex flex-col gap-2 z-40 mb-4">
        <button
          onClick={handlePrevPhase}
          disabled={currentPhaseIndex === 0}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xl shadow-lg transition-colors flex items-center justify-center"
          title="Previous phase"
        >
          ↑
        </button>
        <button
          onClick={handleNextPhase}
          disabled={currentPhaseIndex === FLIGHT_PHASES.length - 1}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xl shadow-lg transition-colors flex items-center justify-center"
          title="Next phase"
        >
          ↓
        </button>
      </div>

      {/* Floating Add Item Button at Bottom Left */}
      <div className="fixed bottom-safe-bottom left-4 z-40 mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl shadow-lg transition-colors flex items-center justify-center"
          title="Add recall item"
        >
          +
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-xl max-w-sm mx-4 p-6 safe-bottom">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Delete Flight?
            </h2>
            <p className="text-gray-600 mb-6">
              Flight information cannot be recovered. Are you sure you want to
              delete this flight?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteFlight();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
