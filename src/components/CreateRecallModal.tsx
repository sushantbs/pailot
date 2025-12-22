import { useState, FormEvent } from 'react'
import { FlightPhase } from '../types/index'
import { useRecallManager } from '../hooks/useRecallManager'

interface CreateRecallModalProps {
  onClose: () => void
}

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

export default function CreateRecallModal({ onClose }: CreateRecallModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reference, setReference] = useState('')
  const [selectedPhases, setSelectedPhases] = useState<FlightPhase[]>([])
  const [threats, setThreats] = useState('')
  const [isTier1, setIsTier1] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)

  const { addRecallItem, error, loading } = useRecallManager()

  const handlePhaseToggle = (phase: FlightPhase) => {
    setSelectedPhases(prev =>
      prev.includes(phase)
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const threatsArray = threats
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean)

      let mediaBlob: Blob | undefined
      if (mediaFile) {
        mediaBlob = new Blob([mediaFile], { type: mediaFile.type })
      }

      await addRecallItem({
        title,
        description,
        reference,
        phases: selectedPhases,
        threats: threatsArray,
        isTier1,
        mediaBlob,
      })

      // Reset form and close
      setTitle('')
      setDescription('')
      setReference('')
      setSelectedPhases([])
      setThreats('')
      setIsTier1(false)
      setMediaFile(null)
      onClose()
    } catch (err) {
      // Error is handled by the hook
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end safe-bottom">
      <div className="w-full bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">New Recall Item</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 font-light"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Deicing Procedure"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Additional context for this recall item"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">
              Flight Phases * ({selectedPhases.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FLIGHT_PHASES.map(phase => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => handlePhaseToggle(phase)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors duration-100 touch-target ${
                    selectedPhases.includes(phase)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Reference Pointer
            </label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g., OM-C 4.3.2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Threats (one per line)
            </label>
            <textarea
              value={threats}
              onChange={e => setThreats(e.target.value)}
              placeholder="Icing conditions&#10;Fuel calculations"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Media (Image/PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={e => setMediaFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="tier1"
              checked={isTier1}
              onChange={e => setIsTier1(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="tier1" className="font-semibold text-gray-700">
              Mark as Tier-1 (Critical)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 touch-target"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 touch-target"
            >
              {loading ? 'Saving...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
