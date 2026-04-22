import type { Measurement } from '../../types/measurement';
import { formatDate } from '../../lib/utils';
import { Check, X } from 'lucide-react';

interface Props {
  parsed: Measurement[];
  duplicates: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ParsePreview({ parsed, duplicates, onConfirm, onCancel }: Props) {
  const newMeasurements = parsed.filter((m) => !duplicates.includes(m.date));

  return (
    <div className="bg-aurora-surface border border-aurora-border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        {parsed.length} meting{parsed.length !== 1 ? 'en' : ''} gevonden
      </h3>

      <div className="space-y-2">
        {parsed.map((m) => {
          const isDuplicate = duplicates.includes(m.date);
          return (
            <div
              key={m.date}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDuplicate ? 'bg-aurora-black/50 opacity-50' : 'bg-aurora-black'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{formatDate(m.date)}</span>
                <span className="text-gray-400 text-sm">
                  {m.weight} kg | {m.bodyFatPercentage}% | {m.leanMass} kg lean
                </span>
              </div>
              {isDuplicate && (
                <span className="text-xs text-gray-500 bg-aurora-border px-2 py-1 rounded">
                  Bestaat al
                </span>
              )}
            </div>
          );
        })}
      </div>

      {newMeasurements.length > 0 ? (
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-aurora-gold text-aurora-black rounded-lg font-medium hover:bg-aurora-gold-light transition-colors"
          >
            <Check size={16} />
            {newMeasurements.length} nieuwe meting{newMeasurements.length !== 1 ? 'en' : ''} importeren
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 border border-aurora-border rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={16} />
            Annuleren
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Alle metingen bestaan al in je data.</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-aurora-border rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          >
            Sluiten
          </button>
        </div>
      )}
    </div>
  );
}
