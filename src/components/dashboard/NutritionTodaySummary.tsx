import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
      ? 'var(--color-positive)'
      : status === 'amber'
        ? 'var(--color-aurora-gold)'
        : status === 'red'
          ? 'var(--color-negative)'
          : 'var(--color-ink-4)';

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-ink-3)' }}
        >
          {label}
        </span>
        <span className="font-mono text-[11px] tabular-nums" style={{ color: 'var(--color-ink-2)' }}>
          <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{Math.round(current)}</span>
          <span style={{ color: 'var(--color-ink-3)' }}>
            {' '}
            / {target}
            {unit ? ` ${unit}` : ''}
          </span>
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: 'var(--color-bg-sunken)' }}
      >
        <div
          className="h-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: barColor }}
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
      className="rounded-[14px] flex flex-col justify-between transition-colors group"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-rule)',
        padding: 'var(--pad-card)',
      }}
    >
      <div className="flex items-baseline justify-between mb-6">
        <h3
          className="font-display italic text-[22px] m-0"
          style={{ color: 'var(--color-ink)' }}
        >
          Vandaag
        </h3>
        <span
          className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-ink-3)' }}
        >
          doel · {proteinTarget} g · {kcalTarget} kcal
        </span>
      </div>

      <div className="flex flex-col gap-5">
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

      <div
        className="flex items-center justify-end gap-1 mt-6 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: 'var(--color-ink-3)' }}
      >
        Meer loggen
        <ChevronRight size={12} />
      </div>
    </Link>
  );
}
