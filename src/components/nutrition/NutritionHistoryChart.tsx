import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { DailyIntake } from '../../types/nutrition';
import { todayISO } from '../../hooks/useDailyIntake';
import { computeProteinStreak } from '../../lib/nutrition';

type Metric = 'protein' | 'kcal';

interface Props {
  intakes: DailyIntake[];
  proteinTarget: number;
  kcalTarget: number;
  days?: number;
}

interface Row {
  date: string;
  label: string;
  proteinG: number;
  kcal: number;
  isToday: boolean;
}

function buildRange(days: number, intakes: DailyIntake[]): Row[] {
  const map = new Map(intakes.map((i) => [i.date, i]));
  const today = new Date();
  const rows: Row[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    const entry = map.get(iso);
    rows.push({
      date: iso,
      label,
      proteinG: entry?.proteinG ?? 0,
      kcal: entry?.kcal ?? 0,
      isToday: iso === todayISO(),
    });
  }
  return rows;
}

function barColor(value: number, target: number, metric: Metric): string {
  if (value === 0) return 'var(--color-rule-2)';
  const pct = value / target;
  if (metric === 'kcal') {
    if (pct >= 0.9 && pct <= 1.1) return 'var(--color-positive)';
    if (pct >= 0.75 && pct <= 1.25) return 'var(--color-aurora-gold)';
    return 'var(--color-negative)';
  }
  if (pct >= 0.95) return 'var(--color-positive)';
  if (pct >= 0.7) return 'var(--color-aurora-gold)';
  return 'var(--color-negative)';
}

export default function NutritionHistoryChart({
  intakes,
  proteinTarget,
  kcalTarget,
  days = 14,
}: Props) {
  const [metric, setMetric] = useState<Metric>('protein');
  const data = buildRange(days, intakes);
  const hasData = data.some((d) => d.proteinG > 0 || d.kcal > 0);

  const target = metric === 'protein' ? proteinTarget : kcalTarget;
  const unit = metric === 'protein' ? 'g' : 'kcal';
  const dataKey = metric === 'protein' ? 'proteinG' : 'kcal';

  const loggedDays = data.filter((d) => d[dataKey] > 0);
  const avg = loggedDays.length
    ? Math.round(loggedDays.reduce((sum, d) => sum + d[dataKey], 0) / loggedDays.length)
    : 0;

  const daysOnTarget = data.filter((d) => {
    const v = d[dataKey];
    if (v === 0) return false;
    if (metric === 'kcal') {
      const pct = v / target;
      return pct >= 0.9 && pct <= 1.1;
    }
    return v >= target * 0.95;
  }).length;

  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-ink">Laatste {days} dagen</h3>
          <p className="text-xs text-ink-3 mt-0.5">
            Target: {target} {unit} per dag
            {metric === 'kcal' && ' (trainingsdag · ±10% is goed)'}
          </p>
        </div>

        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--color-bg-sunken)', border: '1px solid var(--color-rule)' }}>
          <button
            type="button"
            onClick={() => setMetric('protein')}
            className="px-3 py-1 rounded-md text-xs font-medium transition-colors font-mono uppercase tracking-wider"
            style={{
              background: metric === 'protein' ? 'var(--color-ink)' : 'transparent',
              color: metric === 'protein' ? 'var(--color-bg)' : 'var(--color-ink-3)',
            }}
          >
            Eiwit
          </button>
          <button
            type="button"
            onClick={() => setMetric('kcal')}
            className="px-3 py-1 rounded-md text-xs font-medium transition-colors font-mono uppercase tracking-wider"
            style={{
              background: metric === 'kcal' ? 'var(--color-ink)' : 'transparent',
              color: metric === 'kcal' ? 'var(--color-bg)' : 'var(--color-ink-3)',
            }}
          >
            Kcal
          </button>
        </div>
      </div>

      {hasData && (
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-3">Gem.</div>
            <div className="text-lg font-semibold text-ink tabular-nums">
              {avg} {unit}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-3">In zone</div>
            <div className="text-lg font-semibold text-positive tabular-nums">
              {daysOnTarget}/{loggedDays.length || days}
            </div>
          </div>
          {metric === 'protein' && (
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-3">Streak</div>
              <div className="text-lg font-semibold text-aurora-gold tabular-nums flex items-center gap-1">
                {computeProteinStreak(intakes, proteinTarget)}
                {computeProteinStreak(intakes, proteinTarget) >= 3 && <span>🔥</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-ink-3 text-sm text-center px-4">
          Nog geen log-data. Log vandaag je eerste eiwit + kcal via de snel-knoppen hierboven.
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="label"
                stroke="var(--color-ink-4)"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-ink-4)' }}
                tick={{ fill: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="var(--color-ink-4)"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-ink-4)' }}
                tick={{ fill: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-bg-sunken)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-rule-2)',
                  borderRadius: '8px',
                  color: 'var(--color-ink)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                }}
                formatter={
                  ((value: number) => [`${value} ${unit}`, metric === 'protein' ? 'Eiwit' : 'Kcal']) as unknown as undefined
                }
                labelFormatter={(label) => String(label ?? '')}
              />
              <ReferenceLine
                y={target}
                stroke="var(--color-aurora-gold)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {data.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={barColor(entry[dataKey], target, metric)}
                    opacity={entry.isToday ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
