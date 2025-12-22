import { useAppStore } from '../store/appStore'
import { FlightPhase } from '../types/index'

interface PhaseIndicatorProps {
  currentPhase: FlightPhase
  isCriticalPhase: boolean
  itemCount: number
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

export default function PhaseIndicator({
  currentPhase,
  isCriticalPhase,
  itemCount,
}: PhaseIndicatorProps) {
  const { setCurrentPhase, setIsCriticalPhase } = useAppStore()

  return (
    <div className="phase-indicator safe-top">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 font-normal">CURRENT</div>
          <div className="text-2xl font-bold">{currentPhase}</div>
          <div className="text-xs text-gray-400 mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
        </div>
        <button
          onClick={() => setIsCriticalPhase(!isCriticalPhase)}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-100 ${
            isCriticalPhase
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {isCriticalPhase ? '🚨 Tier-1 Only' : 'Show All'}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {FLIGHT_PHASES.map(phase => (
          <button
            key={phase}
            onClick={() => setCurrentPhase(phase)}
            className={`phase-toggle whitespace-nowrap ${
              currentPhase === phase
                ? 'phase-toggle.active'
                : 'phase-toggle.inactive'
            }`}
          >
            {phase}
          </button>
        ))}
      </div>
    </div>
  )
}
