import type { Measurement, Goal } from '../types/measurement';
import type { NutritionSettings, DailyIntake } from '../types/nutrition';
import { SEED_MEASUREMENTS } from '../data/seed';

const MEASUREMENTS_KEY = 'aurora-measurements';
const GOALS_KEY = 'aurora-goals';
const NUTRITION_KEY = 'aurora-nutrition';
const INTAKE_KEY = 'aurora-intake';

export function loadMeasurements(): Measurement[] {
  const stored = localStorage.getItem(MEASUREMENTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Corrupted data, reset to seed
    }
  }
  saveMeasurements(SEED_MEASUREMENTS);
  return [...SEED_MEASUREMENTS];
}

export function saveMeasurements(measurements: Measurement[]): void {
  localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(measurements));
}

export function loadGoals(): Goal[] {
  const stored = localStorage.getItem(GOALS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function loadNutritionSettings(): NutritionSettings | null {
  const stored = localStorage.getItem(NUTRITION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as NutritionSettings;
  } catch {
    return null;
  }
}

export function saveNutritionSettings(settings: NutritionSettings): void {
  localStorage.setItem(NUTRITION_KEY, JSON.stringify(settings));
}

export function loadDailyIntakes(): DailyIntake[] {
  const stored = localStorage.getItem(INTAKE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as DailyIntake[];
  } catch {
    return [];
  }
}

export function saveDailyIntakes(intakes: DailyIntake[]): void {
  localStorage.setItem(INTAKE_KEY, JSON.stringify(intakes));
}

export function exportData(): string {
  return JSON.stringify({
    measurements: loadMeasurements(),
    goals: loadGoals(),
    nutrition: loadNutritionSettings(),
    intakes: loadDailyIntakes(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
