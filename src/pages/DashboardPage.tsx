import type { Measurement, Goal } from '../types/measurement';
import { Hero } from '../components/dashboard/Hero';
import { MeasurementsGrid } from '../components/dashboard/MeasurementsGrid';
import NutritionTodaySummary from '../components/dashboard/NutritionTodaySummary';
import WeightChart from '../components/charts/WeightChart';
import BodyFatChart from '../components/charts/BodyFatChart';
import CompositionChart from '../components/charts/CompositionChart';

interface Props {
  measurements: Measurement[];
  goals: Goal[];
  getLatest: () => Measurement | null;
  getFirst: () => Measurement | null;
}

/** Vind de meting die het dichtst bij N dagen geleden ligt */
function findRefAt(measurements: Measurement[], daysAgo: number): Measurement | null {
  if (measurements.length === 0) return null;
  const target = new Date();
  target.setDate(target.getDate() - daysAgo);
  let best: Measurement | null = null;
  let bestDiff = Infinity;
  for (const m of measurements) {
    const d = new Date(m.date);
    const diff = Math.abs(d.getTime() - target.getTime());
    if (diff < bestDiff) {
      best = m;
      bestDiff = diff;
    }
  }
  return best;
}

export function DashboardPage({ measurements, goals }: Props) {
  const bfGoal = goals.find((g) => g.field === 'bodyFatPercentage');

  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: 'var(--color-ink-3)' }}>
          Geen metingen gevonden. Importeer een PDF om te beginnen.
        </p>
      </div>
    );
  }

  const latest = measurements[measurements.length - 1];
  const previous = measurements.length >= 2 ? measurements[measurements.length - 2] : null;
  const weekAgo = findRefAt(measurements.slice(0, -1), 7);
  const monthAgo = findRefAt(measurements.slice(0, -1), 30);

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: '1480px',
        padding: '0 32px 80px',
      }}
    >
      {/* Top row: Hero (col-7) + Vandaag voeding (col-5) */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: '1.4fr 1fr',
          gap: 'var(--gap-grid)',
          marginBottom: 'var(--gap-grid)',
        }}
      >
        <Hero latest={latest} weekAgo={weekAgo} monthAgo={monthAgo} />
        <NutritionTodaySummary measurements={measurements} />
      </div>

      {/* Trend: weight + composition */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: '1fr',
          gap: 'var(--gap-grid)',
          marginBottom: 'var(--gap-grid)',
        }}
      >
        <WeightChart measurements={measurements} />
      </div>

      {/* Body fat % + Composition */}
      <div
        className="grid mb-5"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--gap-grid)',
          marginBottom: 'var(--gap-grid)',
        }}
      >
        <BodyFatChart measurements={measurements} goalTarget={bfGoal?.targetValue} />
        <CompositionChart measurements={measurements} />
      </div>

      {/* Lichaamsmaten grid */}
      <MeasurementsGrid latest={latest} previous={previous} />
    </div>
  );
}
