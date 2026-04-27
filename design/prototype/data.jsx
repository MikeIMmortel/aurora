// Verzonnen voorbeelddata — vervang later met je echte cijfers.
// Datums in ISO, gewichten in kg, lengtes in cm.

const PROFILE = {
  name: 'Jij',
  height: 182,        // cm
  birthYear: 1992,
  startDate: '2025-08-01',
};

// 90 dagen body composition trend (laatste = vandaag)
function generateTrend() {
  const days = 90;
  const out = [];
  const today = new Date('2026-04-27');
  // doelrichting: gewicht zakt licht, vetmassa daalt sneller, spiermassa stijgt
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const t = (days - 1 - i) / (days - 1); // 0..1
    const wave = Math.sin(i / 6) * 0.25 + Math.sin(i / 17) * 0.4;
    const weight = 84.2 - t * 2.6 + wave;
    const fatPct = 22.4 - t * 3.1 + Math.sin(i / 9) * 0.3;
    const musclePct = 41.8 + t * 1.6 + Math.cos(i / 11) * 0.2;
    const waterPct = 56.1 + t * 0.4 + Math.sin(i / 13) * 0.15;
    out.push({
      date: d.toISOString().slice(0, 10),
      weight: +weight.toFixed(1),
      fatPct: +fatPct.toFixed(1),
      musclePct: +musclePct.toFixed(1),
      waterPct: +waterPct.toFixed(1),
      fatKg: +(weight * fatPct / 100).toFixed(1),
      muscleKg: +(weight * musclePct / 100).toFixed(1),
    });
  }
  return out;
}

const TREND = generateTrend();
const TODAY = TREND[TREND.length - 1];
const YESTERDAY = TREND[TREND.length - 2];
const WEEK_AGO = TREND[TREND.length - 8];
const MONTH_AGO = TREND[TREND.length - 31];
const START = TREND[0];

const BMI = +(TODAY.weight / Math.pow(PROFILE.height / 100, 2)).toFixed(1);

// Lichaamsmaten (omtrek in cm)
const MEASUREMENTS = [
  { label: 'Borst',       value: 104.2, delta: +1.8, unit: 'cm' },
  { label: 'Taille',      value:  84.6, delta: -3.2, unit: 'cm' },
  { label: 'Heup',        value:  98.1, delta: -1.4, unit: 'cm' },
  { label: 'Bovenarm',    value:  37.4, delta: +1.1, unit: 'cm' },
  { label: 'Bovenbeen',   value:  58.9, delta: +0.6, unit: 'cm' },
  { label: 'Kuit',        value:  39.2, delta: +0.3, unit: 'cm' },
];

// Dieet — vandaag
const NUTRITION_TODAY = {
  kcal: { eaten: 1840, target: 2350 },
  protein: { eaten: 162, target: 175 }, // g
  carbs:   { eaten: 178, target: 240 },
  fat:     { eaten:  58, target:  78 },
  water:   { eaten: 2.1, target: 3.0 }, // L
  meals: [
    { time: '07:42', name: 'Skyr · havermout · blauwe bessen', kcal: 410, p: 38, c: 52, f: 9 },
    { time: '12:15', name: 'Kip · zoete aardappel · broccoli', kcal: 620, p: 58, c: 64, f: 14 },
    { time: '16:00', name: 'Whey shake · banaan',              kcal: 280, p: 38, c: 32, f: 4 },
    { time: '19:30', name: 'Zalm · quinoa · spinazie',         kcal: 530, p: 28, c: 30, f: 31 },
  ],
};

// Macro-week trend (laatste 7 dagen, kcal)
const KCAL_WEEK = [2280, 2410, 1980, 2150, 2520, 1870, 1840];
const KCAL_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

// Krachttraining — recente sessies
const STRENGTH_RECENT = [
  { date: '2026-04-26', name: 'Push',  duration: 62, volume: 8420, prs: 1, lifts: ['Bench 92.5×5', 'OHP 60×6', 'Incline DB 32×8'] },
  { date: '2026-04-24', name: 'Pull',  duration: 71, volume: 9180, prs: 0, lifts: ['Deadlift 160×3', 'Pull-up BW+15×6', 'Row 80×8'] },
  { date: '2026-04-22', name: 'Legs',  duration: 68, volume: 11240, prs: 2, lifts: ['Squat 130×5', 'RDL 110×8', 'Leg press 220×10'] },
  { date: '2026-04-19', name: 'Push',  duration: 58, volume: 7980, prs: 0, lifts: ['Bench 90×5', 'OHP 57.5×6', 'Dips BW+10×8'] },
];

// Rust / herstel signalen
const READINESS = {
  sleep: { hours: 7.4, target: 8.0 },
  rhr:   { value: 54, delta: -2 },     // resting heart rate
  hrv:   { value: 68, delta: +4 },     // ms
  steps: { value: 9420, target: 10000 },
};

Object.assign(window, {
  PROFILE, TREND, TODAY, YESTERDAY, WEEK_AGO, MONTH_AGO, START,
  BMI, MEASUREMENTS, NUTRITION_TODAY, KCAL_WEEK, KCAL_LABELS,
  STRENGTH_RECENT, READINESS,
});
