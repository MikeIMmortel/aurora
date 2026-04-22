import type { Measurement } from '../../types/measurement';
import StatCard from './StatCard';
import { calculateBMI, getBMICategory } from '../../lib/utils';

interface StatsRowProps {
  measurements: Measurement[];
}

export default function StatsRow({ measurements }: StatsRowProps) {
  if (measurements.length === 0) return null;

  const current = measurements[measurements.length - 1];
  const previous = measurements.length >= 2 ? measurements[measurements.length - 2] : null;

  const computeDelta = (curr: number, prev: number | null): number | null => {
    if (prev === null) return null;
    return curr - prev;
  };

  const weightDelta = computeDelta(current.weight, previous?.weight ?? null);
  const bodyFatDelta = computeDelta(current.bodyFatPercentage, previous?.bodyFatPercentage ?? null);
  const leanMassDelta = computeDelta(current.leanMass, previous?.leanMass ?? null);
  const fatMassDelta = computeDelta(current.fatMass, previous?.fatMass ?? null);

  const currentBMI = calculateBMI(current.weight, current.height);
  const previousBMI = previous ? calculateBMI(previous.weight, previous.height) : null;
  const bmiDelta = computeDelta(currentBMI, previousBMI);
  const bmiImproved = bmiDelta !== null ? bmiDelta < 0 : null;
  const bmiCategory = getBMICategory(currentBMI);

  // Target weight for healthy BMI (≤ 25)
  const heightM = current.height / 100;
  const targetWeight = 25.0 * heightM * heightM;
  const kgToGo = current.weight - targetWeight;
  const bmiSubtitle =
    kgToGo > 0
      ? `Streef: ≤${targetWeight.toFixed(0)} kg (−${kgToGo.toFixed(1)})`
      : 'Gezond gewicht ✓';

  // For weight and fatMass: decrease = improvement (negative delta = improved)
  // For bodyFatPercentage: decrease = improvement (negative delta = improved)
  // For leanMass: increase = improvement (positive delta = improved)
  const weightImproved = weightDelta !== null ? weightDelta < 0 : null;
  const bodyFatImproved = bodyFatDelta !== null ? bodyFatDelta < 0 : null;
  const leanMassImproved = leanMassDelta !== null ? leanMassDelta > 0 : null;
  const fatMassImproved = fatMassDelta !== null ? fatMassDelta < 0 : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Gewicht"
        value={current.weight}
        unit="kg"
        delta={weightDelta}
        improved={weightImproved}
      />
      <StatCard
        label="BMI"
        value={Math.round(currentBMI * 10) / 10}
        unit={bmiCategory.label}
        unitColor={bmiCategory.color}
        delta={bmiDelta !== null ? Math.round(bmiDelta * 10) / 10 : null}
        improved={bmiImproved}
        subtitle={bmiSubtitle}
      />
      <StatCard
        label="Vetpercentage"
        value={current.bodyFatPercentage}
        unit="%"
        delta={bodyFatDelta}
        improved={bodyFatImproved}
      />
      <StatCard
        label="Spiermassa"
        value={current.leanMass}
        unit="kg"
        delta={leanMassDelta}
        improved={leanMassImproved}
      />
      <StatCard
        label="Vetmassa"
        value={current.fatMass}
        unit="kg"
        delta={fatMassDelta}
        improved={fatMassImproved}
      />
    </div>
  );
}
