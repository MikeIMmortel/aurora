import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate } from '../../lib/utils';

interface BodyFatChartProps {
  measurements: Measurement[];
  goalTarget?: number;
}

export default function BodyFatChart({ measurements, goalTarget }: BodyFatChartProps) {
  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    bodyFatPercentage: m.bodyFatPercentage,
  }));

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Vetpercentage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8A55C" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#C8A55C" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            formatter={((value: any) => [`${Number(value).toFixed(1)}%`, 'Vetpercentage']) as any}
          />
          {goalTarget !== undefined && (
            <ReferenceLine
              y={goalTarget}
              stroke="#A07D3A"
              strokeDasharray="6 4"
              label={{
                value: `Doel: ${goalTarget}%`,
                fill: '#A07D3A',
                fontSize: 12,
                position: 'insideTopRight',
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="bodyFatPercentage"
            stroke="#C8A55C"
            strokeWidth={2}
            fill="url(#bodyFatGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
