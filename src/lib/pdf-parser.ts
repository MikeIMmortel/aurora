import * as pdfjsLib from 'pdfjs-dist';
import type { Measurement } from '../types/measurement';
import { parseDutchDate, parseEuropeanNumber, generateId } from './utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

const LABEL_MAP: Record<string, string> = {
  'Datum': 'date',
  'Geslacht': 'gender',
  'Leeftijd': 'age',
  'Lengte': 'height',
  'Gewicht': 'weight',
  'Vetpercentage': 'bodyFatPercentage',
  'Vetmassa': 'fatMass',
  'Vetvrije-massa': 'leanMass',
  'Buikomvang': 'circumferences.belly',
  'Armomvang': 'circumferences.arm',
  'Bovenbeen': 'circumferences.upperLeg',
  'Triceps': 'skinfolds.triceps',
  'Subscapular': 'skinfolds.subscapular',
  'Supralliac': 'skinfolds.suprailiac',
  'Axilla': 'skinfolds.axilla',
  'Buik': 'skinfolds.belly',
  'Borst': 'skinfolds.chest',
  'Dijbeen': 'skinfolds.thigh',
};

function parseGender(raw: string): 'male' | 'female' {
  return raw.toLowerCase().includes('vrouw') ? 'female' : 'male';
}

function parseAge(raw: string): { age: number; dateOfBirth: string } {
  // "50 25-07-1975" -> { age: 50, dateOfBirth: "1975-07-25" }
  const parts = raw.trim().split(/\s+/);
  const age = parseInt(parts[0], 10);
  let dateOfBirth = '';
  if (parts[1]) {
    const dobParts = parts[1].split('-');
    if (dobParts.length === 3) {
      dateOfBirth = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    }
  }
  return { age: isNaN(age) ? 0 : age, dateOfBirth };
}

function isMeasurementPage(fieldMap: Record<string, string>): boolean {
  return 'date' in fieldMap && 'weight' in fieldMap && 'bodyFatPercentage' in fieldMap;
}

function buildMeasurement(fieldMap: Record<string, string>): Measurement {
  const { age, dateOfBirth } = parseAge(fieldMap['age'] || '0');

  return {
    id: generateId(),
    date: parseDutchDate(fieldMap['date'] || ''),
    gender: parseGender(fieldMap['gender'] || 'Man'),
    age,
    dateOfBirth,
    height: parseEuropeanNumber(fieldMap['height'] || '0'),
    weight: parseEuropeanNumber(fieldMap['weight'] || '0'),
    bodyFatPercentage: parseEuropeanNumber(fieldMap['bodyFatPercentage'] || '0'),
    fatMass: parseEuropeanNumber(fieldMap['fatMass'] || '0'),
    leanMass: parseEuropeanNumber(fieldMap['leanMass'] || '0'),
    circumferences: {
      belly: parseEuropeanNumber(fieldMap['circumferences.belly'] || '0'),
      arm: parseEuropeanNumber(fieldMap['circumferences.arm'] || '0'),
      upperLeg: parseEuropeanNumber(fieldMap['circumferences.upperLeg'] || '0'),
    },
    skinfolds: {
      triceps: parseEuropeanNumber(fieldMap['skinfolds.triceps'] || '0'),
      subscapular: parseEuropeanNumber(fieldMap['skinfolds.subscapular'] || '0'),
      suprailiac: parseEuropeanNumber(fieldMap['skinfolds.suprailiac'] || '0'),
      axilla: parseEuropeanNumber(fieldMap['skinfolds.axilla'] || '0'),
      belly: parseEuropeanNumber(fieldMap['skinfolds.belly'] || '0'),
      chest: parseEuropeanNumber(fieldMap['skinfolds.chest'] || '0'),
      thigh: parseEuropeanNumber(fieldMap['skinfolds.thigh'] || '0'),
    },
  };
}

export async function parsePdf(file: File): Promise<Measurement[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const measurements: Measurement[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    const pageMidX = viewport.width / 2;

    const leftItems: Array<{ text: string; y: number }> = [];
    const rightItems: Array<{ text: string; y: number }> = [];

    for (const item of textContent.items) {
      if (!('str' in item) || !item.str.trim()) continue;
      const x = item.transform[4];
      const y = item.transform[5];

      if (x < pageMidX) {
        leftItems.push({ text: item.str.trim(), y });
      } else {
        rightItems.push({ text: item.str.trim(), y });
      }
    }

    // Match labels (left) to values (right) by closest y-coordinate
    const fieldMap: Record<string, string> = {};
    for (const label of leftItems) {
      const englishKey = LABEL_MAP[label.text];
      if (!englishKey) continue;

      let bestMatch: { text: string; dist: number } | null = null;
      for (const rItem of rightItems) {
        const dist = Math.abs(rItem.y - label.y);
        if (!bestMatch || dist < bestMatch.dist) {
          bestMatch = { text: rItem.text, dist };
        }
      }

      if (bestMatch && bestMatch.dist < 15) {
        fieldMap[englishKey] = bestMatch.text;
      }
    }

    if (isMeasurementPage(fieldMap)) {
      measurements.push(buildMeasurement(fieldMap));
    }
  }

  return measurements;
}
