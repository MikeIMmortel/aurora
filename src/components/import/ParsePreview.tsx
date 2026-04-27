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
    <div
      className="rounded-[14px] flex flex-col"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-rule)',
        padding: 'var(--pad-card)',
        gap: 16,
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>
        {parsed.length} meting{parsed.length !== 1 ? 'en' : ''} <span style={{ color: 'var(--color-aurora-gold)' }}>gevonden</span>
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
                <span className="text-ink-3 text-sm">
                  {m.weight} kg | {m.bodyFatPercentage}% | {m.leanMass} kg lean
                </span>
              </div>
              {isDuplicate && (
                <span className="text-xs text-ink-3 bg-aurora-border px-2 py-1 rounded">
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
            className="flex items-center gap-2 px-4 py-2 border border-aurora-border rounded-lg text-ink-3 hover:text-ink transition-colors"
          >
            <X size={16} />
            Annuleren
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-ink-3">Alle metingen bestaan al in je data.</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-aurora-border rounded-lg text-ink-3 hover:text-ink transition-colors"
          >
            Sluiten
          </button>
        </div>
      )}
    </div>
  );
}
