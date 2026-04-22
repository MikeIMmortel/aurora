import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate } from '../../lib/utils';

interface CircumferenceChartProps {
  measurements: Measurement[];
}

export default function CircumferenceChart({ measurements }: CircumferenceChartProps) {
  if (measurements.length === 0) return null;

  const first = measurements[0].circumferences;

  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    belly:
      first.belly !== 0
        ? ((m.circumferences.belly - first.belly) / first.belly) * 100
        : 0,
    arm:
      first.arm !== 0
        ? ((m.circumferences.arm - first.arm) / first.arm) * 100
        : 0,
    upperLeg:
      first.upperLeg !== 0
        ? ((m.circumferences.upperLeg - first.upperLeg) / first.upperLeg) * 100
        : 0,
  }));

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Omtrekken (% verandering)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#2A2A2A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#2A2A2A' }}
            tickLine={false}
            unit="%"
            domain={[-10, 10]}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            formatter={((value: any) => [`${Number(value).toFixed(1)}%`]) as any}
          />
          <Legend
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                belly: 'Buik',
                arm: 'Arm',
                upperLeg: 'Bovenbeen',
              };
              return (
                <span style={{ color: '#E5E7EB', fontSize: 13 }}>
                  {labels[value] ?? value}
                </span>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="belly"
            stroke="#C8A55C"
            strokeWidth={2}
            dot={{ r: 3, fill: '#C8A55C' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="arm"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={{ r: 3, fill: '#60A5FA' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="upperLeg"
            stroke="#A78BFA"
            strokeWidth={2}
            dot={{ r: 3, fill: '#A78BFA' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
