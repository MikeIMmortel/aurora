import type { Measurement } from '../types/measurement';

/** Lineair interpoleren tussen a en b met factor t (0→1) */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Alle numerieke velden van een Measurement interpoleren */
export function interpolateMeasurement(a: Measurement, b: Measurement, t: number): Measurement {
  return {
    ...a,
    weight: lerp(a.weight, b.weight, t),
    bodyFatPercentage: lerp(a.bodyFatPercentage, b.bodyFatPercentage, t),
    fatMass: lerp(a.fatMass, b.fatMass, t),
    leanMass: lerp(a.leanMass, b.leanMass, t),
    circumferences: {
      belly: lerp(a.circumferences.belly, b.circumferences.belly, t),
      arm: lerp(a.circumferences.arm, b.circumferences.arm, t),
      upperLeg: lerp(a.circumferences.upperLeg, b.circumferences.upperLeg, t),
    },
    skinfolds: {
      triceps: lerp(a.skinfolds.triceps, b.skinfolds.triceps, t),
      subscapular: lerp(a.skinfolds.subscapular, b.skinfolds.subscapular, t),
      suprailiac: lerp(a.skinfolds.suprailiac, b.skinfolds.suprailiac, t),
      axilla: lerp(a.skinfolds.axilla, b.skinfolds.axilla, t),
      belly: lerp(a.skinfolds.belly, b.skinfolds.belly, t),
      chest: lerp(a.skinfolds.chest, b.skinfolds.chest, t),
      thigh: lerp(a.skinfolds.thigh, b.skinfolds.thigh, t),
    },
  };
}

/**
 * Geometrie-parameters voor elk lichaamsdeel.
 * Elke waarde wordt berekend uit de meetdata.
 */
export interface BodyParams {
  // Hoofd + nek (constant)
  headRadius: number;
  neckRadius: number;

  // Torso
  chestRadiusX: number; // breedte bovenlichaam (zijwaarts)
  chestRadiusZ: number; // diepte bovenlichaam (voor/achter)
  waistRadiusX: number; // breedte taille
  waistRadiusZ: number; // diepte taille

  // Armen
  upperArmRadius: number;
  forearmRadius: number;

  // Benen
  upperLegRadius: number;
  lowerLegRadius: number;

  // Overall vet-factor voor subtiele "zachtheid"
  fatFactor: number;
}

/**
 * Overdrijvingsfactor: versterkt de afwijking van het referentiepunt.
 * Factor 5 = een verschil van 2 cm ziet eruit als 10 cm.
 * Zo worden subtiele fitnessveranderingen duidelijk zichtbaar.
 */
const EXAGGERATION = 5;

/** Referentiewaarden (gemiddelden over Mike's 5 metingen) */
const REF = {
  belly: 93.9,        // cm
  arm: 30.2,          // cm
  upperLeg: 54.4,     // cm
  bodyFat: 19.1,      // %
  bellySkinfold: 38,  // mm
  chestSkinfold: 12.9, // mm
};

/** Versterk afwijking van referentie: ref + (value - ref) * factor */
function amplify(value: number, reference: number, factor = EXAGGERATION): number {
  return reference + (value - reference) * factor;
}

/** Map een Measurement naar geometrie-parameters */
export function measurementToBody(m: Measurement): BodyParams {
  const TWO_PI = 2 * Math.PI;

  // Versterk de meetwaarden rond hun gemiddelde
  const ampBelly = amplify(m.circumferences.belly, REF.belly);
  const ampArm = amplify(m.circumferences.arm, REF.arm);
  const ampUpperLeg = amplify(m.circumferences.upperLeg, REF.upperLeg);
  const ampBodyFat = amplify(m.bodyFatPercentage, REF.bodyFat);
  const ampBellySkinfold = amplify(m.skinfolds.belly, REF.bellySkinfold);
  const ampChestSkinfold = amplify(m.skinfolds.chest, REF.chestSkinfold);

  // Omtrek → straal → schaal (cm→units: /100)
  const armRadius = ampArm / TWO_PI / 100;
  const upperLegRadius = ampUpperLeg / TWO_PI / 100;
  const waistRadius = ampBelly / TWO_PI / 100;

  // Vet- en skinfold-factoren voor torso-vorm
  const fatFactor = 1.0 + (ampBodyFat - 18.0) * 0.015;
  const bellyFactor = 1.0 + (ampBellySkinfold - 35) * 0.005;
  const chestFactor = 1.0 + (ampChestSkinfold - 12) * 0.004;

  // Borst iets breder dan diep
  const baseChestRadius = 0.16;
  const chestRadiusX = baseChestRadius * chestFactor * 1.1;
  const chestRadiusZ = baseChestRadius * chestFactor * 0.85;

  // Taille/buik: gestuurd door buikomvang + belly skinfold
  const waistRadiusX = waistRadius * bellyFactor * 0.95;
  const waistRadiusZ = waistRadius * bellyFactor * 0.85;

  return {
    headRadius: 0.09,
    neckRadius: 0.04,
    chestRadiusX,
    chestRadiusZ,
    waistRadiusX,
    waistRadiusZ,
    upperArmRadius: armRadius,
    forearmRadius: 0.035,
    upperLegRadius,
    lowerLegRadius: 0.045,
    fatFactor,
  };
}

/** Interpoleer twee BodyParams met factor t */
export function interpolateBody(a: BodyParams, b: BodyParams, t: number): BodyParams {
  return {
    headRadius: lerp(a.headRadius, b.headRadius, t),
    neckRadius: lerp(a.neckRadius, b.neckRadius, t),
    chestRadiusX: lerp(a.chestRadiusX, b.chestRadiusX, t),
    chestRadiusZ: lerp(a.chestRadiusZ, b.chestRadiusZ, t),
    waistRadiusX: lerp(a.waistRadiusX, b.waistRadiusX, t),
    waistRadiusZ: lerp(a.waistRadiusZ, b.waistRadiusZ, t),
    upperArmRadius: lerp(a.upperArmRadius, b.upperArmRadius, t),
    forearmRadius: lerp(a.forearmRadius, b.forearmRadius, t),
    upperLegRadius: lerp(a.upperLegRadius, b.upperLegRadius, t),
    lowerLegRadius: lerp(a.lowerLegRadius, b.lowerLegRadius, t),
    fatFactor: lerp(a.fatFactor, b.fatFactor, t),
  };
}
