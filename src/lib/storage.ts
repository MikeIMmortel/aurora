import type { Measurement, Goal } from '../types/measurement';
import type { NutritionSettings, DailyIntake } from '../types/nutrition';
import { SEED_MEASUREMENTS } from '../data/seed';

const MEASUREMENTS_KEY = 'aurora-measurements';
const GOALS_KEY = 'aurora-goals';
const NUTRITION_KEY = 'aurora-nutrition';
const INTAKE_KEY = 'aurora-intake';

const API_URL = '/api/data';

interface ServerData {
  measurements?: Measurement[];
  goals?: Goal[];
  nutrition?: NutritionSettings | null;
  intakes?: DailyIntake[];
}

function getAllLocalData(): ServerData {
  return {
    measurements: loadMeasurements(),
    goals: loadGoals(),
    nutrition: loadNutritionSettings(),
    intakes: loadDailyIntakes(),
  };
}

/**
 * Stuur alle lokale data naar de server (fire-and-forget).
 * Wordt aangeroepen na elke save*. Als de server onbereikbaar is
 * (bv. op GitHub Pages), is dat stil — localStorage blijft de bron.
 */
function pushToServer(): void {
  // Niet awaiten: we willen de UI niet blokkeren
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getAllLocalData()),
  }).catch(() => {
    // Geen server beschikbaar — localStorage is authoritative
  });
}

/**
 * Haal data van de server en sla op in localStorage.
 * Draaien we op een static host (geen /api/data), dan doet dit niets
 * en blijft localStorage leidend.
 *
 * Conflict-resolution: als server data heeft, wint server. Als server
 * leeg is maar localStorage niet, pushen we localStorage omhoog (zodat
 * een Mac die al data had de server init).
 */
export async function hydrateFromServer(): Promise<void> {
  let serverData: ServerData | null = null;

  try {
    const r = await fetch(API_URL, { cache: 'no-store' });
    if (!r.ok) return;
    serverData = (await r.json()) as ServerData;
  } catch {
    // Geen server beschikbaar, alles lokaal
    return;
  }

  const serverHasData =
    (serverData?.measurements?.length ?? 0) > 0 ||
    (serverData?.goals?.length ?? 0) > 0 ||
    (serverData?.intakes?.length ?? 0) > 0 ||
    !!serverData?.nutrition;

  if (serverHasData && serverData) {
    if (serverData.measurements !== undefined) {
      localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(serverData.measurements));
    }
    if (serverData.goals !== undefined) {
      localStorage.setItem(GOALS_KEY, JSON.stringify(serverData.goals));
    }
    if (serverData.nutrition) {
      localStorage.setItem(NUTRITION_KEY, JSON.stringify(serverData.nutrition));
    }
    if (serverData.intakes !== undefined) {
      localStorage.setItem(INTAKE_KEY, JSON.stringify(serverData.intakes));
    }
  } else {
    // Server is leeg: push lokale data omhoog als we die hebben
    const local = getAllLocalData();
    const localHasData =
      (local.measurements?.length ?? 0) > 0 ||
      (local.goals?.length ?? 0) > 0 ||
      (local.intakes?.length ?? 0) > 0 ||
      !!local.nutrition;
    if (localHasData) {
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(local),
        });
      } catch {
        /* stil */
      }
    }
  }
}

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
  pushToServer();
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
  pushToServer();
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
  pushToServer();
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
  pushToServer();
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
