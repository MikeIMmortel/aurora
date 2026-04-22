import type { Measurement, Goal } from '../types/measurement';
import StatsRow from '../components/dashboard/StatsRow';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import NutritionTodaySummary from '../components/dashboard/NutritionTodaySummary';
import WeightChart from '../components/charts/WeightChart';
import BodyFatChart from '../components/charts/BodyFatChart';
import CircumferenceChart from '../components/charts/CircumferenceChart';
import SkinfoldChart from '../components/charts/SkinfoldChart';
import CompositionChart from '../components/charts/CompositionChart';
import BMIChart from '../components/charts/BMIChart';

interface Props {
  measurements: Measurement[];
  goals: Goal[];
  getLatest: () => Measurement | null;
  getFirst: () => Measurement | null;
}

export function DashboardPage({ measurements, goals }: Props) {
  const bfGoal = goals.find((g) => g.field === 'bodyFatPercentage');

  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Geen metingen gevonden. Importeer een PDF om te beginnen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <StatsRow measurements={measurements} />
      <NutritionTodaySummary measurements={measurements} />
      <ProgressSummary measurements={measurements} />
      <WeightChart measurements={measurements} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BMIChart measurements={measurements} />
        <BodyFatChart measurements={measurements} goalTarget={bfGoal?.targetValue} />
      </div>
      <CompositionChart measurements={measurements} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CircumferenceChart measurements={measurements} />
        <SkinfoldChart measurements={measurements} />
      </div>
    </div>
  );
}
