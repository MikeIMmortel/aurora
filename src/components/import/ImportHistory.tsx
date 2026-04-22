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
    <div className="bg-aurora-surface border border-aurora-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-aurora-border">
        <h3 className="font-semibold">Alle metingen ({measurements.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aurora-border text-gray-400">
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
                    className="text-gray-500 hover:text-negative transition-colors p-1"
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
