export interface Measurement {
  id: string;
  date: string; // ISO date: "2025-11-06"

  gender: 'male' | 'female';
  age: number;
  dateOfBirth: string;
  height: number; // cm

  // Body composition
  weight: number; // kg
  bodyFatPercentage: number; // %
  fatMass: number; // kg
  leanMass: number; // kg

  // Circumferences (cm)
  circumferences: {
    belly: number;
    arm: number;
    upperLeg: number;
  };

  // 7-point skinfold (mm)
  skinfolds: {
    triceps: number;
    subscapular: number;
    suprailiac: number;
    axilla: number;
    belly: number;
    chest: number;
    thigh: number;
  };
}

export interface Goal {
  id: string;
  field: GoalField;
  targetValue: number;
  unit: string;
  direction: 'decrease' | 'increase';
  createdAt: string;
}

export type GoalField =
  | 'weight'
  | 'bodyFatPercentage'
  | 'fatMass'
  | 'leanMass'
  | 'circumferences.belly'
  | 'circumferences.arm'
  | 'circumferences.upperLeg';

export const GOAL_FIELD_LABELS: Record<GoalField, string> = {
  weight: 'Gewicht',
  bodyFatPercentage: 'Vetpercentage',
  fatMass: 'Vetmassa',
  leanMass: 'Vetvrije massa',
  'circumferences.belly': 'Buikomvang',
  'circumferences.arm': 'Armomvang',
  'circumferences.upperLeg': 'Bovenbeen',
};

export const GOAL_FIELD_UNITS: Record<GoalField, string> = {
  weight: 'kg',
  bodyFatPercentage: '%',
  fatMass: 'kg',
  leanMass: 'kg',
  'circumferences.belly': 'cm',
  'circumferences.arm': 'cm',
  'circumferences.upperLeg': 'cm',
};

export const GOAL_FIELD_DIRECTIONS: Record<GoalField, 'decrease' | 'increase'> = {
  weight: 'decrease',
  bodyFatPercentage: 'decrease',
  fatMass: 'decrease',
  leanMass: 'increase',
  'circumferences.belly': 'decrease',
  'circumferences.arm': 'increase',
  'circumferences.upperLeg': 'increase',
};
