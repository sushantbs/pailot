import { useState } from "react";
import { useAppStore } from "../store/appStore";
import FlightCreationModal from "./FlightCreationModal";
import FlightDetailView from "./FlightDetailView";

export default function FlightListScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  const { flightLists } = useAppStore();

  const formatFlightTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFlightDuration = (departure: number, arrival: number) => {
    const hours = Math.floor((arrival - departure) / (1000 * 60 * 60));
    const minutes = Math.floor(
      ((arrival - departure) % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `${hours}h ${minutes}m`;
  };

  if (selectedFlightId) {
    return (
      <FlightDetailView
        flightId={selectedFlightId}
        onClose={() => setSelectedFlightId(null)}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold">Flights</h1>
        <p className="text-gray-400 text-sm mt-1">
          {flightLists.length} flight{flightLists.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Flights List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {flightLists.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <p className="text-lg font-semibold mb-2">No flights yet</p>
              <p className="text-sm">Create a new flight to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {[...flightLists]
              .sort((a, b) => b.departureTime - a.departureTime)
              .map((flight) => (
                <button
                  key={flight.id}
                  onClick={() => setSelectedFlightId(flight.id!)}
                  className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {flight.title}
                    </h3>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {flight.activeItemIds.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Depart</p>
                      <p className="font-semibold text-gray-900">
                        {formatFlightTime(flight.departureTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Arrive</p>
                      <p className="font-semibold text-gray-900">
                        {formatFlightTime(flight.arrivalTime)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Duration:{" "}
                    {getFlightDuration(
                      flight.departureTime,
                      flight.arrivalTime
                    )}
                  </p>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Create Flight Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow-lg font-semibold hover:bg-blue-700 active:bg-blue-800 text-lg"
        >
          + New Flight
        </button>
      </div>

      {/* Flight Creation Modal */}
      {showCreateModal && (
        <FlightCreationModal
          onClose={() => setShowCreateModal(false)}
          onFlightCreated={(flightId) => {
            setShowCreateModal(false);
            setSelectedFlightId(flightId);
          }}
        />
      )}
    </div>
  );
}
