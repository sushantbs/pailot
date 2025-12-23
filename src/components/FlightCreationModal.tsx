import { useState, FormEvent } from 'react'
import { useAppStore } from '../store/appStore'
import { StorageManager } from '../lib/database'

interface FlightCreationModalProps {
  onClose: () => void
  onFlightCreated: (flightId: number) => void
}

export default function FlightCreationModal({
  onClose,
  onFlightCreated,
}: FlightCreationModalProps) {
  const [fromAirport, setFromAirport] = useState('')
  const [toAirport, setToAirport] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { setActiveFlightList } = useAppStore()

  const generateFlightTitle = (from: string, to: string, depTime: Date) => {
    const hours = String(depTime.getHours()).padStart(2, '0')
    const minutes = String(depTime.getMinutes()).padStart(2, '0')
    return `${from}-${to} ${hours}${minutes}`
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!fromAirport.trim() || !toAirport.trim()) {
        throw new Error('Airport codes are required')
      }

      if (!departureDate || !departureTime || !arrivalDate || !arrivalTime) {
        throw new Error('All date and time fields are required')
      }

      const depDateTime = new Date(`${departureDate}T${departureTime}`)
      const arrDateTime = new Date(`${arrivalDate}T${arrivalTime}`)

      if (depDateTime >= arrDateTime) {
        throw new Error('Departure time must be before arrival time')
      }

      const title = generateFlightTitle(
        fromAirport.toUpperCase(),
        toAirport.toUpperCase(),
        depDateTime
      )

      const flightId = await StorageManager.addFlightList({
        fromAirport: fromAirport.toUpperCase(),
        toAirport: toAirport.toUpperCase(),
        departureTime: depDateTime.getTime(),
        arrivalTime: arrDateTime.getTime(),
        title,
        activeItemIds: [],
      })

      // Set as active flight
      setActiveFlightList(flightId)

      // Reload flight lists
      const flightLists = await StorageManager.getAllFlightLists()
      useAppStore.getState().setFlightLists(flightLists)

      onFlightCreated(flightId)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create flight'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center safe-bottom">
      <div className="w-full max-w-md bg-white rounded-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">New Flight</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 font-light">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">From Airport</label>
              <input
                type="text"
                value={fromAirport}
                onChange={(e) => setFromAirport(e.target.value.toUpperCase())}
                placeholder="e.g., JFK"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">To Airport</label>
              <input
                type="text"
                value={toAirport}
                onChange={(e) => setToAirport(e.target.value.toUpperCase())}
                placeholder="e.g., LAX"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base font-mono text-center"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-semibold mb-2">Departure</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
              />
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Arrival</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
              />
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
              />
            </div>
          </div>

          {fromAirport && toAirport && departureDate && departureTime && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Flight Title</p>
              <p className="text-lg font-bold text-blue-900">
                {generateFlightTitle(
                  fromAirport,
                  toAirport,
                  new Date(`${departureDate}T${departureTime}`)
                )}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Creating...' : 'Create Flight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
