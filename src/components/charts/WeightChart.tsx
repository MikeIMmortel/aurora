import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate } from '../../lib/utils';

interface WeightChartProps {
  measurements: Measurement[];
}

export default function WeightChart({ measurements }: WeightChartProps) {
  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    weight: m.weight,
    leanMass: m.leanMass,
    fatMass: m.fatMass,
  }));

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
      <h3 className="text-base font-semibold text-white mb-4">Lichaamscompositie</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#2A2A2A' }}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#2A2A2A' }}
            unit=" kg"
            width={60}
            domain={['dataMin - 3', 'dataMax + 3']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '0.75rem',
              color: '#FFFFFF',
              fontSize: 13,
            }}
            labelStyle={{ color: '#9CA3AF', marginBottom: 4 }}
            formatter={((value: any) => [`${Number(value).toFixed(1)} kg`]) as any}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#C8A55C"
            strokeWidth={3}
            dot={{ r: 4, fill: '#C8A55C', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#C8A55C', strokeWidth: 2, stroke: '#1A1A1A' }}
            name="weight"
          />
          <Line
            type="monotone"
            dataKey="leanMass"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={{ r: 3, fill: '#4ADE80', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#4ADE80', strokeWidth: 2, stroke: '#1A1A1A' }}
            name="leanMass"
          />
          <Line
            type="monotone"
            dataKey="fatMass"
            stroke="#F87171"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 3, fill: '#F87171', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#F87171', strokeWidth: 2, stroke: '#1A1A1A' }}
            name="fatMass"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
