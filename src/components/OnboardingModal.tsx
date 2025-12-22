interface OnboardingModalProps {
  onClose: () => void
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Install PRA</h2>
        <p className="text-gray-700 mb-6">
          For the best experience and offline database persistence, add this app to your home screen.
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="text-4xl mb-3">📱</div>
          <p className="text-sm text-gray-700 mb-3">
            Tap the <strong>Share</strong> button below
          </p>
          <p className="text-sm text-gray-700">
            Then select <strong>Add to Home Screen</strong>
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 touch-target"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
