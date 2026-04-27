interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  delta: number | null;
  improved: boolean | null;
  subtitle?: string;
  unitColor?: string;
}

export default function StatCard({ label, value, unit, delta, improved, subtitle, unitColor }: StatCardProps) {
  const deltaColor =
    improved === null ? 'text-ink-3' : improved ? 'text-positive' : 'text-negative';

  const arrow =
    delta === null
      ? null
      : delta > 0
        ? '\u25B2'
        : delta < 0
          ? '\u25BC'
          : '\u25CF';

  const formattedValue =
    unit === '%' ? value.toFixed(1) : value.toFixed(1);

  const formattedDelta =
    delta !== null
      ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} ${unit}`
      : null;

  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-4 flex flex-col gap-1">
      <span className="text-sm text-ink-3 font-medium">{label}</span>
      <span className="text-2xl font-bold text-ink">
        {formattedValue}
        <span className={`text-base font-normal ml-1 ${unitColor ?? 'text-ink-3'}`}>{unit}</span>
      </span>
      {delta !== null && (
        <span className={`text-sm font-medium ${deltaColor} flex items-center gap-1`}>
          <span className="text-xs">{arrow}</span>
          {formattedDelta}
        </span>
      )}
      {subtitle && (
        <span className="text-xs text-ink-3 mt-0.5">{subtitle}</span>
      )}
    </div>
  );
}
