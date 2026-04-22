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
  if (value === 0) return '#2A2A2A';
  const pct = value / target;
  if (metric === 'kcal') {
    // Voor kcal is 90–110% ideaal; te veel is ook niet goed
    if (pct >= 0.9 && pct <= 1.1) return '#4ADE80';
    if (pct >= 0.75 && pct <= 1.25) return '#C8A55C';
    return '#F87171';
  }
  // Eiwit: meer is beter (tot op zekere hoogte)
  if (pct >= 0.95) return '#4ADE80';
  if (pct >= 0.7) return '#C8A55C';
  return '#F87171';
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
          <h3 className="text-lg font-semibold text-white">Laatste {days} dagen</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Target: {target} {unit} per dag
            {metric === 'kcal' && ' (trainingsdag · ±10% is goed)'}
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-aurora-black rounded-lg border border-aurora-border">
          <button
            type="button"
            onClick={() => setMetric('protein')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              metric === 'protein'
                ? 'bg-aurora-gold/20 text-aurora-gold-light'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Eiwit
          </button>
          <button
            type="button"
            onClick={() => setMetric('kcal')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              metric === 'kcal'
                ? 'bg-aurora-gold/20 text-aurora-gold-light'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Kcal
          </button>
        </div>
      </div>

      {hasData && (
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Gem.</div>
            <div className="text-lg font-semibold text-white tabular-nums">
              {avg} {unit}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">In zone</div>
            <div className="text-lg font-semibold text-[#4ADE80] tabular-nums">
              {daysOnTarget}/{loggedDays.length || days}
            </div>
          </div>
          {metric === 'protein' && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500">Streak</div>
              <div className="text-lg font-semibold text-aurora-gold tabular-nums flex items-center gap-1">
                {computeProteinStreak(intakes, proteinTarget)}
                {computeProteinStreak(intakes, proteinTarget) >= 3 && <span>🔥</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-gray-500 text-sm text-center px-4">
          Nog geen log-data. Log vandaag je eerste eiwit + kcal via de snel-knoppen hierboven.
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="label"
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#2A2A2A' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#2A2A2A' }}
              />
              <Tooltip
                cursor={{ fill: '#222222' }}
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={
                  ((value: number) => [`${value} ${unit}`, metric === 'protein' ? 'Eiwit' : 'Kcal']) as unknown as undefined
                }
                labelFormatter={(label) => String(label ?? '')}
              />
              <ReferenceLine
                y={target}
                stroke="#C8A55C"
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
