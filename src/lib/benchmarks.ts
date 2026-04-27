import type { Measurement } from '../types/measurement';

/**
 * Categorisatie van een metriek t.o.v. gezondheids-/fitness-normen.
 * - excellent: top tier, atletisch
 * - good: gezonde range
 * - average: doorsnee bevolking
 * - concern: aandacht, verhoogd risico
 * - poor: actie nodig, hoog risico
 */
export type Category = 'excellent' | 'good' | 'average' | 'concern' | 'poor';

export const CATEGORY_LABELS: Record<Category, string> = {
  excellent: 'Atletisch',
  good: 'Gezond',
  average: 'Gemiddeld',
  concern: 'Aandacht',
  poor: 'Risico',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  excellent: '#4ADE80',
  good: '#86EFAC',
  average: '#C8A55C',
  concern: '#F59E0B',
  poor: '#F87171',
};

/** Een drempelpunt op de spectrum-bar */
export interface Threshold {
  /** Waarde waar deze categorie begint */
  from: number;
  category: Category;
  /** Optionele label boven de drempel */
  label?: string;
}

/** Resultaat van een benchmark voor één metriek */
export interface Benchmark {
  key: string;
  metric: string;
  description: string;
  value: number;
  unit: string;
  /** Min en max van de spectrum-as voor weergave */
  axisMin: number;
  axisMax: number;
  thresholds: Threshold[];
  category: Category;
  context: string;
  source: string;
  /** Ideale waarde / streefwaarde voor jouw demografie */
  ideal: number;
  /** Korte uitleg waarom dit het ideaal is */
  idealNote: string;
  /** Hoeveel je af bent van het ideaal (in dezelfde unit) */
  deltaToIdeal: number;
}

// =============================================================================
// Berekeningen
// =============================================================================

export function calculateBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

/** Fat-Free Mass Index — corrigeert spiermassa voor lengte */
export function calculateFFMI(leanMassKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return leanMassKg / (h * h);
}

export function calculateWaistToHeight(waistCm: number, heightCm: number): number {
  return waistCm / heightCm;
}

export function calculateSkinfoldSum(m: Measurement): number {
  const s = m.skinfolds;
  return s.triceps + s.subscapular + s.suprailiac + s.axilla + s.belly + s.chest + s.thigh;
}

// =============================================================================
// Categorisatie helpers
// =============================================================================

function categorizeFromThresholds(value: number, thresholds: Threshold[]): Category {
  // Thresholds zijn gesorteerd oplopend; pak de laatste waarvan from <= value
  let result: Category = thresholds[0].category;
  for (const t of thresholds) {
    if (value >= t.from) result = t.category;
    else break;
  }
  return result;
}

// =============================================================================
// Per-metriek thresholds
// =============================================================================

/**
 * Vetpercentage — ACE / ACSM normen voor mannen, leeftijd-gecorrigeerd.
 * Voor 50+ liggen normen iets hoger (lichaam slaat van nature meer vet op).
 */
function bodyFatThresholds(age: number): Threshold[] {
  if (age >= 50) {
    return [
      { from: 0,  category: 'excellent', label: 'Atletisch' },
      { from: 11, category: 'good',      label: 'Fit' },
      { from: 18, category: 'average',   label: 'Gemiddeld' },
      { from: 24, category: 'concern',   label: 'Aandacht' },
      { from: 28, category: 'poor',      label: 'Hoog' },
    ];
  }
  if (age >= 30) {
    return [
      { from: 0,  category: 'excellent' },
      { from: 11, category: 'good' },
      { from: 17, category: 'average' },
      { from: 23, category: 'concern' },
      { from: 27, category: 'poor' },
    ];
  }
  return [
    { from: 0,  category: 'excellent' },
    { from: 8,  category: 'good' },
    { from: 14, category: 'average' },
    { from: 20, category: 'concern' },
    { from: 25, category: 'poor' },
  ];
}

/** BMI — WHO standaard. Beperkte waarde voor gespierde mensen. */
const BMI_THRESHOLDS: Threshold[] = [
  { from: 0,    category: 'concern', label: 'Onder' },
  { from: 18.5, category: 'good',    label: 'Normaal' },
  { from: 25,   category: 'concern', label: 'Over' },
  { from: 30,   category: 'poor',    label: 'Obesitas' },
];

/**
 * FFMI — Fat-Free Mass Index. Maatstaf voor "natuurlijke" spiermassa
 * gecorrigeerd voor lengte. Kouri et al. 1995 (men).
 * Boven ~25 wordt zeldzaam zonder PEDs.
 */
const FFMI_THRESHOLDS: Threshold[] = [
  { from: 0,    category: 'concern',   label: 'Laag' },
  { from: 18,   category: 'average',   label: 'Doorsnee' },
  { from: 20,   category: 'good',      label: 'Bovengem.' },
  { from: 22,   category: 'excellent', label: 'Atletisch' },
  { from: 25,   category: 'excellent', label: 'Top-natuurlijk' },
];

/** Buikomvang voor mannen — WHO/NIH richtlijnen. */
const WAIST_MEN_THRESHOLDS: Threshold[] = [
  { from: 0,   category: 'good',    label: 'Laag risico' },
  { from: 94,  category: 'concern', label: 'Verhoogd' },
  { from: 102, category: 'poor',    label: 'Hoog' },
];

/** Buik:lengte ratio — Ashwell. Beste enkele indicator van metabool risico. */
const WAIST_TO_HEIGHT_THRESHOLDS: Threshold[] = [
  { from: 0,    category: 'good',    label: 'Gezond' },
  { from: 0.50, category: 'concern', label: 'Borderline' },
  { from: 0.55, category: 'poor',    label: 'Hoog risico' },
];

/** 7-plooi som voor mannen 50+ — Jackson-Pollock referenties. */
function skinfoldSumThresholds(age: number): Threshold[] {
  if (age >= 50) {
    return [
      { from: 0,   category: 'excellent', label: 'Zeer lean' },
      { from: 50,  category: 'good',      label: 'Lean' },
      { from: 90,  category: 'average',   label: 'Gemiddeld' },
      { from: 120, category: 'concern',   label: 'Hoog' },
    ];
  }
  return [
    { from: 0,  category: 'excellent' },
    { from: 40, category: 'good' },
    { from: 75, category: 'average' },
    { from: 110, category: 'concern' },
  ];
}

// =============================================================================
// Builder voor de hele lijst benchmarks
// =============================================================================

export function buildBenchmarks(m: Measurement): Benchmark[] {
  const bmi = calculateBMI(m.weight, m.height);
  const ffmi = calculateFFMI(m.leanMass, m.height);
  const wHt = calculateWaistToHeight(m.circumferences.belly, m.height);
  const skSum = calculateSkinfoldSum(m);
  const bfThresholds = bodyFatThresholds(m.age);
  const skThresholds = skinfoldSumThresholds(m.age);

  // Ideale buikomvang = 88 cm (5 cm onder 94-grens) of 47% van lengte (gezond)
  const idealWaist = Math.min(88, m.height * 0.47);
  const idealBMI = 23.5;
  const idealWeight = idealBMI * (m.height / 100) ** 2;

  const raw: Omit<Benchmark, 'deltaToIdeal'>[] = [
    {
      key: 'bodyFat',
      metric: 'Vetpercentage',
      description: `Voor mannen van ${m.age} jaar`,
      value: m.bodyFatPercentage,
      unit: '%',
      axisMin: 5,
      axisMax: 35,
      thresholds: bfThresholds,
      category: categorizeFromThresholds(m.bodyFatPercentage, bfThresholds),
      context: `Gemiddelde Nederlandse man van ~50 zit op ~25% vet. Onder 18% is fit, onder 11% atletisch.`,
      source: 'ACE/ACSM richtlijnen, leeftijd-gecorrigeerd',
      ideal: 14,
      idealNote: 'Atletisch maar realistisch voor 50+ zonder extreem te diëten',
    },
    {
      key: 'ffmi',
      metric: 'FFMI (spier-index)',
      description: `Spiermassa gecorrigeerd voor lengte (${m.height} cm)`,
      value: ffmi,
      unit: '',
      axisMin: 16,
      axisMax: 27,
      thresholds: FFMI_THRESHOLDS,
      category: categorizeFromThresholds(ffmi, FFMI_THRESHOLDS),
      context: `Doorsnee ongetrainde man zit op ~18–19. Boven 22 is atletisch. Boven 25 is zeldzaam zonder doping.`,
      source: 'Kouri et al. 1995 — natuurlijke bovengrenzen',
      ideal: 23,
      idealNote: 'Sterk atletisch profiel, haalbaar met serieuze krachttraining',
    },
    {
      key: 'waist',
      metric: 'Buikomvang',
      description: `Indicator van visceraal vet (kort metabool risico)`,
      value: m.circumferences.belly,
      unit: 'cm',
      axisMin: 75,
      axisMax: 120,
      thresholds: WAIST_MEN_THRESHOLDS,
      category: categorizeFromThresholds(m.circumferences.belly, WAIST_MEN_THRESHOLDS),
      context: `Onder 94 cm is laag-risico voor mannen. Onder 90 cm is doorgaans gezond.`,
      source: 'WHO/NIH richtlijnen voor mannen',
      ideal: idealWaist,
      idealNote: `~${(idealWaist).toFixed(0)} cm = veilig onder de risico-drempel én onder 50% van je lengte`,
    },
    {
      key: 'waistToHeight',
      metric: 'Buik : lengte ratio',
      description: `Beste enkele indicator van metabool risico`,
      value: wHt,
      unit: '',
      axisMin: 0.40,
      axisMax: 0.65,
      thresholds: WAIST_TO_HEIGHT_THRESHOLDS,
      category: categorizeFromThresholds(wHt, WAIST_TO_HEIGHT_THRESHOLDS),
      context: `Vuistregel: je buikomvang mag niet meer zijn dan de helft van je lengte (< 0,50).`,
      source: 'Ashwell M., 2012 — meta-analyse 31 studies',
      ideal: 0.47,
      idealNote: 'Comfortabel onder de gezondheids-drempel van 0,50',
    },
    {
      key: 'bmi',
      metric: 'BMI',
      description: `Beperkte waarde door je hoge spiermassa — zie FFMI hierboven`,
      value: bmi,
      unit: '',
      axisMin: 17,
      axisMax: 35,
      thresholds: BMI_THRESHOLDS,
      category: categorizeFromThresholds(bmi, BMI_THRESHOLDS),
      context: `BMI gooit spier en vet op één hoop. Met FFMI ${ffmi.toFixed(1)} valt jouw "overgewicht" door spier, niet vet.`,
      source: 'WHO standaard — werkt slecht voor gespierde mensen',
      ideal: idealBMI,
      idealNote: `BMI ${idealBMI} = ~${idealWeight.toFixed(0)} kg bij jouw lengte. Negeer dit als je FFMI hoog blijft.`,
    },
    {
      key: 'skinfold',
      metric: '7-plooi som',
      description: `Som van alle huidplooien (mm)`,
      value: skSum,
      unit: 'mm',
      axisMin: 30,
      axisMax: 150,
      thresholds: skThresholds,
      category: categorizeFromThresholds(skSum, skThresholds),
      context: `Som < 50 mm is zeer lean voor 50+. Tussen 50–90 is fit. Boven 120 is hoog.`,
      source: 'Jackson-Pollock referenties voor mannen 50+',
      ideal: 70,
      idealNote: 'Lean range voor 50+ zonder onhoudbaar laag te gaan',
    },
  ];

  return raw.map((b) => ({
    ...b,
    deltaToIdeal: b.value - b.ideal,
  }));
}

/**
 * Geeft een hoofd-oordeel over de geheel cohort-vergelijking.
 * Telt categorieën en mapt naar één samenvattende string.
 */
export function summarizeBenchmarks(benchmarks: Benchmark[]): {
  level: Category;
  message: string;
} {
  const counts: Record<Category, number> = {
    excellent: 0, good: 0, average: 0, concern: 0, poor: 0,
  };
  for (const b of benchmarks) counts[b.category]++;

  const top = counts.excellent + counts.good;
  const mid = counts.average;
  const low = counts.concern + counts.poor;

  if (top >= 4 && low === 0) {
    return {
      level: 'excellent',
      message: 'Bovengemiddeld op bijna alles voor jouw leeftijdsgroep. Doorgaan op deze koers.',
    };
  }
  if (top >= 3 && low <= 1) {
    return {
      level: 'good',
      message: 'Sterk profiel voor mannen van jouw leeftijd. Een paar punten om verder te verfijnen.',
    };
  }
  if (mid >= 3 || (top >= 1 && low >= 2)) {
    return {
      level: 'average',
      message: 'Doorsnee niveau. Met focus op de aandachtspunten kan dit snel beter.',
    };
  }
  if (low >= 3) {
    return {
      level: 'concern',
      message: 'Meerdere indicatoren vragen aandacht. Begin met buikvet en eiwit.',
    };
  }
  return {
    level: 'average',
    message: 'Gemengd beeld — focus op de rode/oranje gebieden hieronder.',
  };
}
