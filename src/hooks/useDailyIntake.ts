import { useState, useCallback, useMemo } from 'react';
import type { DailyIntake } from '../types/nutrition';
import { loadDailyIntakes, saveDailyIntakes } from '../lib/storage';

/** Lokale ISO datum (yyyy-mm-dd) — niet UTC, om middernacht-issues te voorkomen */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useDailyIntake() {
  const [intakes, setIntakes] = useState<DailyIntake[]>(loadDailyIntakes);

  const today = todayISO();

  const todayIntake = useMemo(
    () => intakes.find((i) => i.date === today) ?? { date: today, proteinG: 0 },
    [intakes, today],
  );

  const persist = useCallback((updated: DailyIntake[]) => {
    saveDailyIntakes(updated);
    setIntakes(updated);
  }, []);

  const upsertToday = useCallback(
    (mutate: (current: DailyIntake) => DailyIntake) => {
      setIntakes((prev) => {
        const existing = prev.find((i) => i.date === today);
        const base: DailyIntake = existing ?? { date: today, proteinG: 0 };
        const next = mutate(base);
        const updated = existing
          ? prev.map((i) => (i.date === today ? next : i))
          : [...prev, next];
        saveDailyIntakes(updated);
        return updated;
      });
    },
    [today],
  );

  const addProtein = useCallback(
    (grams: number) => {
      upsertToday((curr) => ({ ...curr, proteinG: Math.max(0, curr.proteinG + grams) }));
    },
    [upsertToday],
  );

  const setProtein = useCallback(
    (grams: number) => {
      upsertToday((curr) => ({ ...curr, proteinG: Math.max(0, grams) }));
    },
    [upsertToday],
  );

  const addEntry = useCallback(
    (entry: { proteinG?: number; kcal?: number }) => {
      upsertToday((curr) => ({
        ...curr,
        proteinG: Math.max(0, curr.proteinG + (entry.proteinG ?? 0)),
        kcal: Math.max(0, (curr.kcal ?? 0) + (entry.kcal ?? 0)),
      }));
    },
    [upsertToday],
  );

  const setKcal = useCallback(
    (kcal: number) => {
      upsertToday((curr) => ({ ...curr, kcal: Math.max(0, kcal) }));
    },
    [upsertToday],
  );

  const resetToday = useCallback(() => {
    setIntakes((prev) => {
      const updated = prev.filter((i) => i.date !== today);
      saveDailyIntakes(updated);
      return updated;
    });
  }, [today]);

  return {
    intakes,
    todayIntake,
    today,
    addProtein,
    setProtein,
    addEntry,
    setKcal,
    resetToday,
    persist,
  };
}
