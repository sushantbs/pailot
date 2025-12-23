import { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { usePhaseFilter } from '../hooks/usePhaseFilter'
import { StorageManager } from '../lib/database'
import { FlightList } from '../types/index'
import PhaseSidebar from './PhaseSidebar'
import RecallCardList from './RecallCardList'
import CreateRecallModal from './CreateRecallModal'

interface FlightDetailViewProps {
  flightId: number
  onClose: () => void
}

export default function FlightDetailView({ flightId, onClose }: FlightDetailViewProps) {
  const [flight, setFlight] = useState<FlightList | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const { currentPhase, isCriticalPhase, recallItems } = useAppStore()
  const filteredItems = usePhaseFilter(currentPhase, recallItems, isCriticalPhase)

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
      <PhaseSidebar currentPhase={currentPhase} isCriticalPhase={isCriticalPhase} />

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

        {/* Add Item Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="m-4 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold hover:bg-blue-700 active:bg-blue-800 touch-target"
        >
          + New Item
        </button>

        {showCreateModal && (
          <CreateRecallModal
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </div>
  )
}
