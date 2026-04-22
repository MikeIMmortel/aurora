import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';
import type { Measurement } from '../../types/measurement';

interface SkinfoldChartProps {
  measurements: Measurement[];
}

const SKINFOLD_LABELS: { key: keyof Measurement['skinfolds']; label: string }[] = [
  { key: 'triceps', label: 'Triceps' },
  { key: 'subscapular', label: 'Subscapular' },
  { key: 'suprailiac', label: 'Suprailiac' },
  { key: 'axilla', label: 'Axilla' },
  { key: 'belly', label: 'Buik' },
  { key: 'chest', label: 'Borst' },
  { key: 'thigh', label: 'Dijbeen' },
];

export default function SkinfoldChart({ measurements }: SkinfoldChartProps) {
  if (measurements.length === 0) return null;

  const firstMeasurement = measurements[0];
  const latestMeasurement = measurements[measurements.length - 1];

  const data = SKINFOLD_LABELS.map(({ key, label }) => ({
    subject: label,
    first: firstMeasurement.skinfolds[key],
    latest: latestMeasurement.skinfolds[key],
  }));

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Huidplooien</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#2A2A2A" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Eerste meting"
            dataKey="first"
            stroke="#6B7280"
            fill="#6B7280"
            fillOpacity={0.1}
            strokeWidth={1.5}
          />
          <Radar
            name="Laatste meting"
            dataKey="latest"
            stroke="#C8A55C"
            fill="#C8A55C"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: '#E5E7EB', fontSize: 13 }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
