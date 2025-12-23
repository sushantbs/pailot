import { RecallItem } from '../types/index'
import RecallCard from './RecallCard'

interface RecallCardListProps {
  items: RecallItem[]
  onAddItem?: () => void
}

export default function RecallCardList({ items, onAddItem }: RecallCardListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <p className="text-lg font-semibold mb-2">No items for this phase</p>
              <p className="text-sm">Create a new recall item or change the flight phase</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="recall-item-enter">
                <RecallCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Button */}
      {onAddItem && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onAddItem}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors touch-target"
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
  )
}
