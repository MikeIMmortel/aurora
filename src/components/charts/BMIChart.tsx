import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate, calculateBMI } from '../../lib/utils';

interface BMIChartProps {
  measurements: Measurement[];
}

export default function BMIChart({ measurements }: BMIChartProps) {
  if (measurements.length === 0) return null;

  const current = measurements[measurements.length - 1];
  const heightM = current.height / 100;
  const currentBMI = calculateBMI(current.weight, current.height);

  // Healthy weight range for this height
  const healthyMin = 18.5 * heightM * heightM; // ~55.4 kg
  const healthyMax = 24.9 * heightM * heightM; // ~74.5 kg
  const targetWeight = 25.0 * heightM * heightM; // BMI 25 boundary

  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    bmi: Math.round(calculateBMI(m.weight, m.height) * 10) / 10,
  }));

  // Y-axis domain: show healthy zone + current value with padding
  const allBMIs = data.map((d) => d.bmi);
  const minBMI = Math.min(...allBMIs, 18.5);
  const maxBMI = Math.max(...allBMIs, 25);
  const yMin = Math.floor(minBMI - 1);
  const yMax = Math.ceil(maxBMI + 1);

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">BMI Verloop</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Lengte {current.height} cm · Leeftijd {current.age} jaar
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white tabular-nums">
            {currentBMI.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400">huidig</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />

          {/* Healthy BMI zone: 18.5 – 24.9 */}
          <ReferenceArea
            y1={18.5}
            y2={24.9}
            fill="#4ADE80"
            fillOpacity={0.08}
            strokeOpacity={0}
          />

          {/* Reference lines for BMI boundaries */}
          <ReferenceLine
            y={18.5}
            stroke="#4ADE80"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
            label={{ value: '18.5', position: 'left', fill: '#4ADE80', fontSize: 10 }}
          />
          <ReferenceLine
            y={24.9}
            stroke="#4ADE80"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
            label={{ value: '24.9', position: 'left', fill: '#4ADE80', fontSize: 10 }}
          />
          <ReferenceLine
            y={30}
            stroke="#F87171"
            strokeDasharray="4 4"
            strokeOpacity={0.3}
            label={{ value: '30 Obesitas', position: 'right', fill: '#F87171', fontSize: 10 }}
          />

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
            domain={[yMin, yMax]}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            formatter={((value: any) => [`${Number(value).toFixed(1)}`]) as any}
            labelFormatter={(label) => String(label ?? '')}
          />
          <Line
            type="monotone"
            dataKey="bmi"
            stroke="#C8A55C"
            strokeWidth={3}
            dot={{ r: 4, fill: '#C8A55C', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#C8A55C', strokeWidth: 2, stroke: '#1A1A1A' }}
            name="BMI"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Target info below chart */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-[#111] p-3">
          <p className="text-xs text-gray-500 mb-1">Gezond gewicht</p>
          <p className="text-sm font-semibold text-[#4ADE80] tabular-nums">
            {healthyMin.toFixed(0)} – {healthyMax.toFixed(0)} kg
          </p>
        </div>
        <div className="rounded-xl bg-[#111] p-3">
          <p className="text-xs text-gray-500 mb-1">Streefgewicht</p>
          <p className="text-sm font-semibold text-aurora-gold tabular-nums">
            ≤ {targetWeight.toFixed(1)} kg
          </p>
        </div>
        <div className="rounded-xl bg-[#111] p-3">
          <p className="text-xs text-gray-500 mb-1">Nog af te vallen</p>
          <p className={`text-sm font-semibold tabular-nums ${current.weight > targetWeight ? 'text-[#F87171]' : 'text-[#4ADE80]'}`}>
            {current.weight > targetWeight
              ? `−${(current.weight - targetWeight).toFixed(1)} kg`
              : '✓ Op streef!'}
          </p>
        </div>
      </div>
    </div>
  );
}
