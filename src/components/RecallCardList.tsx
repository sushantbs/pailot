import { RecallItem } from '../types/index'
import RecallCard from './RecallCard'

interface RecallCardListProps {
  items: RecallItem[]
}

export default function RecallCardList({ items }: RecallCardListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4">
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center text-gray-500">
          <div>
            <p className="text-lg font-semibold mb-2">No items for this phase</p>
            <p className="text-sm">Create a new recall item or change the flight phase</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          {items.map(item => (
            <div key={item.id} className="recall-item-enter">
              <RecallCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
