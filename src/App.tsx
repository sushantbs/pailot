import { useState } from 'react'
import { useAppStore } from './store/appStore'
import { usePhaseFilter } from './hooks/usePhaseFilter'
import PhaseIndicator from './components/PhaseIndicator'
import RecallCardList from './components/RecallCardList'
import CreateRecallModal from './components/CreateRecallModal'
import OnboardingModal from './components/OnboardingModal'

export default function App() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(!(window.navigator as any).standalone)

  const { currentPhase, isCriticalPhase, recallItems } = useAppStore()
  const filteredItems = usePhaseFilter(currentPhase, recallItems, isCriticalPhase)

  return (
    <div className="h-screen bg-gray-50 flex flex-col safe-bottom">
      <PhaseIndicator
        currentPhase={currentPhase}
        isCriticalPhase={isCriticalPhase}
        itemCount={filteredItems.length}
      />

      <RecallCardList items={filteredItems} />

      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-safe-bottom right-4 mb-4 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold hover:bg-blue-700 active:bg-blue-800 touch-target"
      >
        + New Item
      </button>

      {showCreateModal && (
        <CreateRecallModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  )
}
