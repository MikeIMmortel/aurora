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
    improved === null ? 'text-gray-400' : improved ? 'text-[#4ADE80]' : 'text-[#F87171]';

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
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 flex flex-col gap-1">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-2xl font-bold text-white">
        {formattedValue}
        <span className={`text-base font-normal ml-1 ${unitColor ?? 'text-gray-400'}`}>{unit}</span>
      </span>
      {delta !== null && (
        <span className={`text-sm font-medium ${deltaColor} flex items-center gap-1`}>
          <span className="text-xs">{arrow}</span>
          {formattedDelta}
        </span>
      )}
      {subtitle && (
        <span className="text-xs text-gray-500 mt-0.5">{subtitle}</span>
      )}
    </div>
  );
}
