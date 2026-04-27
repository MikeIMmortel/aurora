import type { DayMacros } from '../../types/nutrition';

interface Props {
  title: string;
  subtitle: string;
  macros: DayMacros;
  accent?: boolean;
}

export default function MacroCard({ title, subtitle, macros, accent = false }: Props) {
  const border = accent ? 'border-aurora-gold/60' : 'border-aurora-border';

  return (
    <div className={`rounded-2xl border ${border} bg-aurora-surface p-5 flex flex-col gap-4`}>
      <div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="text-xs text-ink-3 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-aurora-gold">{macros.kcal}</span>
        <span className="text-sm text-ink-3">kcal</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MacroCell label="Eiwit" value={macros.proteinG} unit="g" color="text-positive" />
        <MacroCell label="Koolh." value={macros.carbsG} unit="g" color="text-aurora-gold-light" />
        <MacroCell label="Vet" value={macros.fatG} unit="g" color="text-negative" />
      </div>
    </div>
  );
}

function MacroCell({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 bg-bg-sunken rounded-lg px-3 py-2">
      <span className="text-[10px] text-ink-3 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-semibold">
        <span className={color}>{value}</span>
        <span className="text-xs text-ink-3 ml-1">{unit}</span>
      </span>
    </div>
  );
}
