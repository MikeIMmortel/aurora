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
import {
  chartColors,
  chartCardStyle,
  chartTitleStyle,
  chartMetaStyle,
} from './chartTheme';

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
    <div style={chartCardStyle}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={chartTitleStyle}>Huidplooien</h3>
        <span style={chartMetaStyle}>Eerste vs laatste</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={chartColors.grid} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'var(--color-ink-3)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
            }}
          />
          <PolarRadiusAxis
            angle={90}
            tick={{ fill: 'var(--color-ink-4)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
          />
          <Radar
            name="Eerste meting"
            dataKey="first"
            stroke={chartColors.ink3}
            fill={chartColors.ink3}
            fillOpacity={0.08}
            strokeWidth={1.25}
          />
          <Radar
            name="Laatste meting"
            dataKey="latest"
            stroke={chartColors.accent}
            fill={chartColors.accent}
            fillOpacity={0.2}
            strokeWidth={1.5}
          />
          <Legend
            iconType="line"
            wrapperStyle={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
            formatter={(value: string) => (
              <span style={{ color: 'var(--color-ink-2)' }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
