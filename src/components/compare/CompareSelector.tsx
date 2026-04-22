import type { Measurement } from '../../types/measurement';
import { formatDate } from '../../lib/utils';

interface Props {
  measurements: Measurement[];
  leftDate: string;
  rightDate: string;
  onLeftChange: (date: string) => void;
  onRightChange: (date: string) => void;
}

export function CompareSelector({ measurements, leftDate, rightDate, onLeftChange, onRightChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <select
        value={leftDate}
        onChange={(e) => onLeftChange(e.target.value)}
        className="w-full sm:w-auto bg-aurora-surface border border-aurora-border rounded-lg px-4 py-2 text-sm focus:border-aurora-gold focus:outline-none"
      >
        {measurements.map((m) => (
          <option key={m.date} value={m.date}>{formatDate(m.date)}</option>
        ))}
      </select>

      <span className="text-gray-500 font-medium">vs</span>

      <select
        value={rightDate}
        onChange={(e) => onRightChange(e.target.value)}
        className="w-full sm:w-auto bg-aurora-surface border border-aurora-border rounded-lg px-4 py-2 text-sm focus:border-aurora-gold focus:outline-none"
      >
        {measurements.map((m) => (
          <option key={m.date} value={m.date}>{formatDate(m.date)}</option>
        ))}
      </select>
    </div>
  );
}
