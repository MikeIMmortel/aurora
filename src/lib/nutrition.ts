import type { Measurement } from '../types/measurement';
import type {
  ActivityLevel,
  DailyTargets,
  DayMacros,
  NutritionGoal,
  NutritionSettings,
  QuickAdd,
} from '../types/nutrition';

/**
 * Activiteitsfactoren voor TDEE (totaal dagverbruik).
 * Onderzoek: Mifflin/Katch-McArdle × PAL (physical activity level).
 */
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.5,
  active: 1.65,
  'very-active': 1.8,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Zittend werk, geen sport',
  light: 'Licht actief (1–2× sport)',
  moderate: '2× kracht + 1–2× cardio',
  active: '4–5× intensieve training',
  'very-active': '6–7× training + fysiek werk',
};

export const GOAL_LABELS: Record<NutritionGoal, string> = {
  'fat-loss': 'Vet verliezen',
  recomp: 'Recompositie (vet ↓, spier ↑)',
  'muscle-gain': 'Spiergroei',
};

export const GOAL_DESCRIPTIONS: Record<NutritionGoal, string> = {
  'fat-loss': 'Matig tekort (~350 kcal) met hoog eiwit om spier te behouden.',
  recomp: 'Klein tekort (~150 kcal): vet langzaam eraf, spier langzaam erbij.',
  'muscle-gain': 'Licht overschot (~300 kcal) voor spiergroei met minimale vetwinst.',
};

/** Kcal-aanpassing t.o.v. TDEE per doel */
const GOAL_ADJUSTMENTS: Record<NutritionGoal, number> = {
  'fat-loss': -350,
  recomp: -150,
  'muscle-gain': 300,
};

/**
 * Katch-McArdle BMR — gebruikt vetvrije massa i.p.v. totaalgewicht.
 * Nauwkeuriger dan Harris-Benedict wanneer LBM bekend is.
 */
export function calculateBMR(leanMassKg: number): number {
  return 370 + 21.6 * leanMassKg;
}

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activity]);
}

interface MacroSplitInput {
  weightKg: number;
  kcal: number;
  proteinPerKg: number;
  fatPerKg: number;
}

function splitMacros({
  weightKg,
  kcal,
  proteinPerKg,
  fatPerKg,
}: MacroSplitInput): DayMacros {
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round(weightKg * fatPerKg);
  const carbsKcal = kcal - proteinG * 4 - fatG * 9;
  const carbsG = Math.max(0, Math.round(carbsKcal / 4));
  return { kcal: Math.round(kcal), proteinG, fatG, carbsG };
}

/**
 * Bereken complete dag-doelen uit meting + instellingen.
 * Rustdag = trainingsdag − 200 kcal (minder koolhydraten nodig zonder training).
 * Eiwit blijft gelijk — dat is de non-negotiable voor spierbehoud.
 */
export function calculateDailyTargets(
  measurement: Measurement,
  settings: NutritionSettings,
): DailyTargets {
  const bmr = Math.round(calculateBMR(measurement.leanMass));
  const tdee = calculateTDEE(bmr, settings.activity);
  const adjustment = GOAL_ADJUSTMENTS[settings.goal];

  const trainingKcal = tdee + adjustment;
  const restKcal = trainingKcal - 200;

  const weight = measurement.weight;

  const trainingDay = splitMacros({
    weightKg: weight,
    kcal: trainingKcal,
    proteinPerKg: settings.proteinPerKg,
    fatPerKg: settings.fatPerKg,
  });

  // Rustdag: zelfde eiwit, zelfde vet, minder koolhydraten
  const restDay: DayMacros = {
    kcal: Math.round(restKcal),
    proteinG: trainingDay.proteinG,
    fatG: trainingDay.fatG,
    carbsG: Math.max(
      0,
      Math.round((restKcal - trainingDay.proteinG * 4 - trainingDay.fatG * 9) / 4),
    ),
  };

  return { bmr, tdee, trainingDay, restDay };
}

/**
 * Ingebouwde snel-knoppen — zichtbaar voor iedereen.
 * Gebruikers kunnen eigen knoppen toevoegen die hierachter worden geplaatst.
 */
export const BUILTIN_QUICK_ADDS: QuickAdd[] = [
  { id: 'builtin-skyr', label: 'Skyr', portion: '250 g', proteinG: 25, kcal: 150 },
  { id: 'builtin-shake', label: 'Shake', portion: 'whey + melk', proteinG: 32, kcal: 210 },
  { id: 'builtin-kip', label: 'Kip', portion: '100 g', proteinG: 22, kcal: 110 },
  { id: 'builtin-rotisserie', label: 'Rotisserie', portion: '150 g', proteinG: 35, kcal: 245 },
  { id: 'builtin-huttenkaas', label: 'Hüttenkäse', portion: '200 g', proteinG: 25, kcal: 180 },
  { id: 'builtin-zalm', label: 'Zalm', portion: '150 g', proteinG: 33, kcal: 310 },
  { id: 'builtin-brood', label: 'Brood', portion: '2 sneden protein', proteinG: 14, kcal: 170 },
  { id: 'builtin-pudding', label: 'Eiwit-pudding', portion: 'bakje', proteinG: 20, kcal: 130 },
  { id: 'builtin-franse-kwark', label: 'Franse kwark', portion: '150 g (Lidl)', proteinG: 10, kcal: 165 },
  { id: 'builtin-pannenkoek', label: 'Pannenkoek v1', portion: 'batter + whey', proteinG: 56, kcal: 700 },
  { id: 'builtin-pannenkoek-xl', label: 'Pannenkoek XL', portion: 'v1 + Franse kwark topping', proteinG: 68, kcal: 880 },
];

export const DEFAULT_SETTINGS: NutritionSettings = {
  goal: 'recomp',
  activity: 'moderate',
  proteinPerKg: 2.0,
  fatPerKg: 0.9,
  customQuickAdds: [],
};

/**
 * Bereken hoeveel dagen op rij eiwit-target is gehaald (≥95%).
 * Vandaag wordt overgeslagen als nog niet gehaald — om de streak niet
 * vroeg op de dag onterecht te breken.
 */
export function computeProteinStreak(
  intakes: { date: string; proteinG: number }[],
  target: number,
): number {
  const byDate = new Map(intakes.map((i) => [i.date, i.proteinG]));
  const threshold = target * 0.95;

  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  let streak = 0;
  let offset = 0;

  // Als vandaag nog niet gehaald is, tellen we vanaf gisteren
  const todayVal = byDate.get(todayISO) ?? 0;
  if (todayVal < threshold) offset = 1;

  for (let i = offset; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const val = byDate.get(iso) ?? 0;
    if (val >= threshold) streak++;
    else break;
  }

  return streak;
}
