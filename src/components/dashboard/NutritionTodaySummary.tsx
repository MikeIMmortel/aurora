import { Link } from 'react-router-dom';
import { Utensils, ChevronRight } from 'lucide-react';
import type { Measurement } from '../../types/measurement';
import { useNutritionSettings } from '../../hooks/useNutritionSettings';
import { useDailyIntake } from '../../hooks/useDailyIntake';
import { calculateDailyTargets } from '../../lib/nutrition';

interface Props {
  measurements: Measurement[];
}

function StatBar({
  label,
  current,
  target,
  unit,
  tolerance,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  /** Voor kcal: ±% rondom target = groene zone */
  tolerance?: number;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  let status: 'green' | 'amber' | 'red' | 'neutral';
  if (current === 0) {
    status = 'neutral';
  } else if (tolerance !== undefined) {
    const ratio = current / target;
    const low = 1 - tolerance;
    const high = 1 + tolerance;
    status = ratio >= low && ratio <= high ? 'green' : ratio >= low - 0.15 && ratio <= high + 0.15 ? 'amber' : 'red';
  } else {
    status = pct >= 95 ? 'green' : pct >= 70 ? 'amber' : 'red';
  }

  const barColor =
    status === 'green'
      ? 'bg-[#4ADE80]'
      : status === 'amber'
        ? 'bg-aurora-gold'
        : status === 'red'
          ? 'bg-[#F87171]'
          : 'bg-gray-600';

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs tabular-nums">
          <span className="text-white font-medium">{Math.round(current)}</span>
          <span className="text-gray-600"> / {target} {unit}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-aurora-black overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function NutritionTodaySummary({ measurements }: Props) {
  const { settings } = useNutritionSettings();
  const { todayIntake } = useDailyIntake();

  const latest = measurements[measurements.length - 1];
  if (!latest) return null;

  const targets = calculateDailyTargets(latest, settings);
  const proteinTarget = targets.trainingDay.proteinG;
  const kcalTarget = targets.trainingDay.kcal;

  return (
    <Link
      to="/nutrition"
      className="rounded-2xl border border-aurora-border bg-aurora-surface p-4 flex items-center gap-4 hover:border-aurora-gold/40 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-aurora-gold/10 border border-aurora-gold/30 flex items-center justify-center shrink-0">
        <Utensils size={18} className="text-aurora-gold" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-white">Vandaag</span>
          <span className="text-xs text-gray-500 hidden sm:block">
            doel: {proteinTarget} g eiwit · {kcalTarget} kcal
          </span>
        </div>
        <div className="flex gap-4">
          <StatBar
            label="Eiwit"
            current={todayIntake.proteinG}
            target={proteinTarget}
            unit="g"
          />
          <StatBar
            label="Kcal"
            current={todayIntake.kcal ?? 0}
            target={kcalTarget}
            unit=""
            tolerance={0.1}
          />
        </div>
      </div>

      <ChevronRight size={18} className="text-gray-600 group-hover:text-aurora-gold transition-colors shrink-0" />
    </Link>
  );
}
