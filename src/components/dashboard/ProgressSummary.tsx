import type { Measurement } from '../../types/measurement';

interface ProgressSummaryProps {
  measurements: Measurement[];
}

export default function ProgressSummary({ measurements }: ProgressSummaryProps) {
  if (measurements.length < 2) return null;

  const first = measurements[0];
  const latest = measurements[measurements.length - 1];

  const bodyFatChange = latest.bodyFatPercentage - first.bodyFatPercentage;
  const leanMassChange = latest.leanMass - first.leanMass;
  const bellyChange = latest.circumferences.belly - first.circumferences.belly;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDelta = (value: number, unit: string): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)} ${unit}`;
  };

  const deltaColor = (value: number, decreaseIsGood: boolean): string => {
    if (value === 0) return 'text-gray-400';
    const isImproved = decreaseIsGood ? value < 0 : value > 0;
    return isImproved ? 'text-[#4ADE80]' : 'text-[#F87171]';
  };

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Voortgang</h3>
      <p className="text-white text-sm leading-relaxed">
        <span className="text-gray-400">Sinds {formatDate(first.date)}:</span>{' '}
        <span className="font-medium">Vetpercentage</span>{' '}
        <span className={`font-semibold ${deltaColor(bodyFatChange, true)}`}>
          {formatDelta(bodyFatChange, '%')}
        </span>
        <span className="text-gray-500 mx-2">&middot;</span>
        <span className="font-medium">Spiermassa</span>{' '}
        <span className={`font-semibold ${deltaColor(leanMassChange, false)}`}>
          {formatDelta(leanMassChange, 'kg')}
        </span>
        <span className="text-gray-500 mx-2">&middot;</span>
        <span className="font-medium">Buikomvang</span>{' '}
        <span className={`font-semibold ${deltaColor(bellyChange, true)}`}>
          {formatDelta(bellyChange, 'cm')}
        </span>
      </p>
    </div>
  );
}
