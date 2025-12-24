import { RecallItem } from '../types/index'

interface RecallCardProps {
  item: RecallItem
}

export default function RecallCard({ item }: RecallCardProps) {
  return (
    <div className="recall-card">
      <div className="flex items-start justify-between mb-2">
        {item.isDeeplink ? (
          <a
            href={item.title}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-blue-600 hover:text-blue-800 underline flex-1 break-all"
          >
            {item.title}
          </a>
        ) : (
          <h3 className="text-lg font-bold text-gray-900 flex-1">
            {item.title}
          </h3>
        )}
        {item.isTier1 && <span className="ml-2 text-red-600 font-bold">★</span>}
      </div>

      {item.description && (
        <p className="text-gray-700 mb-2">{item.description}</p>
      )}

      {item.phases.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.phases.map(phase => (
            <span
              key={phase}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
            >
              {phase}
            </span>
          ))}
        </div>
      )}

      {item.threats && item.threats.length > 0 && (
        <div className="pilot-notes">
          <p className="font-semibold text-yellow-900 mb-1">Threats:</p>
          <ul className="list-disc list-inside text-yellow-800">
            {item.threats.map((threat, idx) => (
              <li key={idx}>{threat}</li>
            ))}
          </ul>
        </div>
      )}

      {item.reference && (
        <div className="official-reference">
          <p className="font-semibold mb-1">Ref: {item.reference}</p>
        </div>
      )}

      {item.mediaBlob && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 font-semibold mb-2">Attachment</p>
          <div className="bg-gray-200 h-20 rounded-lg flex items-center justify-center text-sm text-gray-600">
            📎 Media attached
          </div>
        </div>
      )}
    </div>
  )
}
