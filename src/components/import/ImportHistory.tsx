import type { Measurement } from '../../types/measurement';
import { formatDate } from '../../lib/utils';
import { Trash2 } from 'lucide-react';

interface Props {
  measurements: Measurement[];
  onDelete: (id: string) => void;
}

export function ImportHistory({ measurements, onDelete }: Props) {
  const sorted = [...measurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-rule)',
      }}
    >
      <div className="flex items-baseline justify-between" style={{ padding: 'var(--pad-card)', borderBottom: '1px solid var(--color-rule)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>Archief</h3>
        <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10.5, color: 'var(--color-ink-3)' }}>
          {measurements.length} {measurements.length === 1 ? 'meting' : 'metingen'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aurora-border text-ink-3">
              <th className="text-left px-6 py-3 font-medium">Datum</th>
              <th className="text-right px-4 py-3 font-medium">Gewicht</th>
              <th className="text-right px-4 py-3 font-medium">Vet%</th>
              <th className="text-right px-4 py-3 font-medium">Spiermassa</th>
              <th className="text-right px-4 py-3 font-medium">Buikomvang</th>
              <th className="text-right px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.id} className="border-b border-aurora-border/50 hover:bg-aurora-surface-hover transition-colors">
                <td className="px-6 py-3 font-medium">{formatDate(m.date)}</td>
                <td className="text-right px-4 py-3">{m.weight} kg</td>
                <td className="text-right px-4 py-3">{m.bodyFatPercentage}%</td>
                <td className="text-right px-4 py-3">{m.leanMass} kg</td>
                <td className="text-right px-4 py-3">{m.circumferences.belly} cm</td>
                <td className="text-right px-6 py-3">
                  <button
                    onClick={() => onDelete(m.id)}
                    className="text-ink-3 hover:text-negative transition-colors p-1"
                    title="Verwijderen"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
