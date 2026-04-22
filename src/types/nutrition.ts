export type NutritionGoal = 'fat-loss' | 'recomp' | 'muscle-gain';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active';

export interface QuickAdd {
  id: string;
  label: string;
  portion: string;
  proteinG: number;
  kcal: number;
}

export interface NutritionSettings {
  goal: NutritionGoal;
  activity: ActivityLevel;
  /** Eiwit g per kg lichaamsgewicht (gecorrigeerd) */
  proteinPerKg: number;
  /** Vet g per kg lichaamsgewicht (gecorrigeerd) */
  fatPerKg: number;
  /** Eigen snel-knoppen (bovenop de ingebouwde set) */
  customQuickAdds: QuickAdd[];
}

export interface DayMacros {
  kcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export interface DailyTargets {
  /** Basaal metabolisme (Katch-McArdle) */
  bmr: number;
  /** Totaal dagverbruik bij gekozen activiteit */
  tdee: number;
  trainingDay: DayMacros;
  restDay: DayMacros;
}

/** Log van wat je op één dag daadwerkelijk hebt binnengekregen */
export interface DailyIntake {
  /** ISO yyyy-mm-dd (lokale tijd) */
  date: string;
  proteinG: number;
  kcal?: number;
}
