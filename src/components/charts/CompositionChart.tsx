import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate } from '../../lib/utils';

interface CompositionChartProps {
  measurements: Measurement[];
}

export default function CompositionChart({ measurements }: CompositionChartProps) {
  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    leanMass: m.leanMass,
    fatMass: m.fatMass,
  }));

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Lichaamssamenstelling
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vetvrije massa */}
        <div>
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Spiermassa</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="leanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={{ stroke: '#2A2A2A' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={{ stroke: '#2A2A2A' }}
                tickLine={false}
                unit=" kg"
                domain={['dataMin - 1', 'dataMax + 1']}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
                formatter={((value: any) => [`${Number(value).toFixed(1)} kg`]) as any}
              />
              <Area
                type="monotone"
                dataKey="leanMass"
                stroke="#4ADE80"
                strokeWidth={2}
                fill="url(#leanGrad)"
                dot={{ r: 3, fill: '#4ADE80' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vetmassa */}
        <div>
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Vetmassa</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A55C" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C8A55C" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={{ stroke: '#2A2A2A' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={{ stroke: '#2A2A2A' }}
                tickLine={false}
                unit=" kg"
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
                formatter={((value: any) => [`${Number(value).toFixed(1)} kg`]) as any}
              />
              <Area
                type="monotone"
                dataKey="fatMass"
                stroke="#C8A55C"
                strokeWidth={2}
                fill="url(#fatGrad)"
                dot={{ r: 3, fill: '#C8A55C' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
