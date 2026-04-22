import type { Measurement, GoalField } from '../types/measurement';

const DUTCH_MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mrt: 2, mar: 2, apr: 3, mei: 4, may: 4,
  jun: 5, jul: 6, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, dec: 11,
};

export function parseDutchDate(raw: string): string {
  // "6-nov-2025" -> "2025-11-06"
  const parts = raw.trim().split('-');
  if (parts.length !== 3) return raw;
  const day = parseInt(parts[0], 10);
  const month = DUTCH_MONTHS[parts[1].toLowerCase()];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return raw;
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseEuropeanNumber(raw: string): number {
  // "82,7 kg" -> 82.7
  const cleaned = raw.replace(/[^0-9,.-]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDelta(value: number, unit: string): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)} ${unit}`;
}

export function getFieldValue(measurement: Measurement, field: GoalField): number {
  if (field.includes('.')) {
    const [parent, child] = field.split('.') as [keyof Measurement, string];
    const nested = measurement[parent];
    if (typeof nested === 'object' && nested !== null && child in nested) {
      return (nested as Record<string, number>)[child];
    }
    return 0;
  }
  return measurement[field as keyof Measurement] as number;
}

export function calculateDelta(current: number, previous: number): {
  value: number;
  isPositive: boolean;
  isImprovement: (direction: 'increase' | 'decrease') => boolean;
} {
  const value = current - previous;
  return {
    value,
    isPositive: value > 0,
    isImprovement: (direction) =>
      direction === 'increase' ? value > 0 : value < 0,
  };
}

export function generateId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Kledingcorrectie: gewogen bij de trainer met kleren aan.
 * Trek 2,3 kg af voor het werkelijke gewicht.
 */
export const CLOTHING_OFFSET = 2.3;

export function correctMeasurement(m: Measurement): Measurement {
  const correctedWeight = m.weight - CLOTHING_OFFSET;
  const correctedFatMass = correctedWeight * (m.bodyFatPercentage / 100);
  const correctedLeanMass = correctedWeight - correctedFatMass;
  return {
    ...m,
    weight: Math.round(correctedWeight * 10) / 10,
    fatMass: Math.round(correctedFatMass * 10) / 10,
    leanMass: Math.round(correctedLeanMass * 10) / 10,
  };
}

/** BMI = gewicht (kg) / lengte (m)² */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

/** BMI categorie label */
export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Ondergewicht', color: 'text-blue-400' };
  if (bmi < 25) return { label: 'Normaal', color: 'text-positive' };
  if (bmi < 30) return { label: 'Overgewicht', color: 'text-aurora-gold' };
  return { label: 'Obesitas', color: 'text-negative' };
}
