import { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { usePhaseFilter } from '../hooks/usePhaseFilter'
import { StorageManager } from '../lib/database'
import { FlightList, FlightPhase } from '../types/index'
import PhaseSidebar from './PhaseSidebar'
import RecallCardList from './RecallCardList'
import CreateRecallModal from './CreateRecallModal'

const FLIGHT_PHASES: FlightPhase[] = [
  'Preflight',
  'Taxi',
  'Takeoff',
  'Climb',
  'Cruise',
  'Descent',
  'Approach',
  'Landing',
  'Shutdown',
]

interface FlightDetailViewProps {
  flightId: number
  onClose: () => void
}

export default function FlightDetailView({ flightId, onClose }: FlightDetailViewProps) {
  const [flight, setFlight] = useState<FlightList | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const { currentPhase, isCriticalPhase, recallItems, setCurrentPhase } = useAppStore()
  const filteredItems = usePhaseFilter(currentPhase, recallItems, isCriticalPhase)

  const currentPhaseIndex = FLIGHT_PHASES.indexOf(currentPhase)

  useEffect(() => {
    const loadFlight = async () => {
      const flightData = await StorageManager.getFlightList(flightId)
      if (flightData) {
        setFlight(flightData)
        
        // Load recall items for this flight
        const items = await StorageManager.getFlightListItems(flightId)
        useAppStore.getState().setRecallItems(items)
      }
      setLoading(false)
    }

    loadFlight()
  }, [flightId])

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhase(FLIGHT_PHASES[currentPhaseIndex - 1])
    }
  }

  const handleNextPhase = () => {
    if (currentPhaseIndex < FLIGHT_PHASES.length - 1) {
      setCurrentPhase(FLIGHT_PHASES[currentPhaseIndex + 1])
    }
  }

  const handleAddItemForPhase = (phase: FlightPhase) => {
    setCurrentPhase(phase)
    setShowCreateModal(true)
  }

  if (loading || !flight) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading flight...</p>
        </div>
      </div>
    )
  }

  const departureDate = new Date(flight.departureTime)
  const arrivalDate = new Date(flight.arrivalTime)

  return (
    <div className="fixed inset-0 bg-white flex z-50 safe-bottom">
      {/* Sidebar with Phases */}
      <PhaseSidebar 
        currentPhase={currentPhase} 
        isCriticalPhase={isCriticalPhase}
        onAddItemForPhase={handleAddItemForPhase}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white px-4 py-4 border-b border-gray-800 safe-top">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{flight.title}</h1>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-white font-light"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-gray-400">
            <p>
              {departureDate.toLocaleDateString()} {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
              {arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} for <strong>{currentPhase}</strong>
            </p>
          </div>
        </div>

        {/* Recall Items */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <RecallCardList items={filteredItems} />
        </div>

        {showCreateModal && (
          <CreateRecallModal
            onClose={() => setShowCreateModal(false)}
          />
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
    </div>
  )
}
