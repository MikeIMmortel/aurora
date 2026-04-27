import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DailyIntake } from '../../types/nutrition';

interface Props {
  intakes: DailyIntake[];
  proteinTarget: number;
  kcalTarget: number;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Stats voor een venster van 7 dagen eindigend op `endDate` */
function statsForWindow(
  intakes: DailyIntake[],
  endDate: Date,
  proteinTarget: number,
): {
  proteinAvg: number | null;
  kcalAvg: number | null;
  loggedDays: number;
  onTargetDays: number;
} {
  const start = new Date(endDate);
  start.setDate(endDate.getDate() - 6);

  const windowDates = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    windowDates.add(toISO(d));
  }

  const inWindow = intakes.filter((i) => windowDates.has(i.date));
  const withProtein = inWindow.filter((i) => i.proteinG > 0);
  const withKcal = inWindow.filter((i) => (i.kcal ?? 0) > 0);

  const proteinAvg = withProtein.length
    ? Math.round(withProtein.reduce((s, i) => s + i.proteinG, 0) / withProtein.length)
    : null;
  const kcalAvg = withKcal.length
    ? Math.round(withKcal.reduce((s, i) => s + (i.kcal ?? 0), 0) / withKcal.length)
    : null;
  const onTargetDays = withProtein.filter((i) => i.proteinG >= proteinTarget * 0.95).length;

  return {
    proteinAvg,
    kcalAvg,
    loggedDays: Math.max(withProtein.length, withKcal.length),
    onTargetDays,
  };
}

interface DeltaTileProps {
  label: string;
  current: number | null;
  previous: number | null;
  unit: string;
  /** Voor eiwit is hoger beter; voor kcal is dichter bij target beter */
  higherIsBetter?: boolean;
  target?: number;
}

function DeltaTile({ label, current, previous, unit, higherIsBetter = true, target }: DeltaTileProps) {
  if (current === null) {
    return (
      <div className="rounded-xl border border-aurora-border bg-bg-sunken p-4">
        <div className="text-xs uppercase tracking-wider text-ink-3 mb-1">{label}</div>
        <div className="text-sm text-ink-4">Geen data deze week</div>
      </div>
    );
  }

  const delta = previous !== null ? current - previous : null;

  let improved: boolean | null = null;
  if (delta !== null && previous !== null) {
    if (target !== undefined && !higherIsBetter) {
      // Dichter bij target = beter (voor kcal)
      const distCurrent = Math.abs(current - target);
      const distPrevious = Math.abs(previous - target);
      improved = distCurrent < distPrevious;
    } else {
      improved = higherIsBetter ? delta > 0 : delta < 0;
    }
  }

  const trendColor =
    improved === null
      ? 'text-ink-3'
      : improved
        ? 'text-positive'
        : Math.abs(delta ?? 0) < 5
          ? 'text-ink-3'
          : 'text-negative';

  const Icon =
    delta === null || Math.abs(delta) < 2
      ? Minus
      : delta > 0
        ? TrendingUp
        : TrendingDown;

  return (
    <div className="rounded-xl border border-aurora-border bg-bg-sunken p-4 flex flex-col gap-1">
      <div className="text-xs uppercase tracking-wider text-ink-3">{label}</div>
      <div className="text-2xl font-bold text-ink tabular-nums">
        {current}
        <span className="text-sm text-ink-3 ml-1">{unit}</span>
      </div>
      {delta !== null && previous !== null && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <Icon size={12} />
          <span>
            {delta > 0 ? '+' : ''}
            {delta} {unit} vs. vorige week
          </span>
        </div>
      )}
      {delta !== null && previous === null && (
        <div className="text-xs text-ink-4">Vorige week: geen data</div>
      )}
    </div>
  );
}

export default function WeeklyReview({ intakes, proteinTarget, kcalTarget }: Props) {
  const today = new Date();
  const prevWeekEnd = new Date(today);
  prevWeekEnd.setDate(today.getDate() - 7);

  const thisWeek = statsForWindow(intakes, today, proteinTarget);
  const prevWeek = statsForWindow(intakes, prevWeekEnd, proteinTarget);

  const hasAnyData = thisWeek.loggedDays > 0 || prevWeek.loggedDays > 0;

  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-ink">Weekoverzicht</h3>
        <p className="text-xs text-ink-3 mt-0.5">
          Laatste 7 dagen vs. week daarvoor
        </p>
      </div>

      {!hasAnyData ? (
        <div className="h-24 flex items-center justify-center text-ink-3 text-sm text-center">
          Log een week lang om trends te zien.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <DeltaTile
              label="Eiwit gem."
              current={thisWeek.proteinAvg}
              previous={prevWeek.proteinAvg}
              unit="g"
              higherIsBetter
            />
            <DeltaTile
              label="Kcal gem."
              current={thisWeek.kcalAvg}
              previous={prevWeek.kcalAvg}
              unit="kcal"
              higherIsBetter={false}
              target={kcalTarget}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-ink-3 pt-2 border-t border-aurora-border">
            <span>
              <span className="text-ink font-medium">{thisWeek.onTargetDays}/7</span> dagen
              eiwit-target gehaald
            </span>
            {prevWeek.onTargetDays > 0 && (
              <span>
                Vorige week: {prevWeek.onTargetDays}/7
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
