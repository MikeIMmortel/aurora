import { useState, useCallback } from 'react';
import type { NutritionSettings, QuickAdd } from '../types/nutrition';
import { DEFAULT_SETTINGS } from '../lib/nutrition';
import {
  loadNutritionSettings,
  saveNutritionSettings,
} from '../lib/storage';

/** Merge met defaults om ontbrekende velden bij oude data op te vangen */
function hydrate(raw: NutritionSettings | null): NutritionSettings {
  if (!raw) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    customQuickAdds: raw.customQuickAdds ?? [],
  };
}

export function useNutritionSettings() {
  const [settings, setSettings] = useState<NutritionSettings>(
    () => hydrate(loadNutritionSettings()),
  );

  const update = useCallback((partial: Partial<NutritionSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveNutritionSettings(next);
      return next;
    });
  }, []);

  const addCustomQuickAdd = useCallback(
    (item: Omit<QuickAdd, 'id'>) => {
      setSettings((prev) => {
        const newItem: QuickAdd = {
          ...item,
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        const next = {
          ...prev,
          customQuickAdds: [...prev.customQuickAdds, newItem],
        };
        saveNutritionSettings(next);
        return next;
      });
    },
    [],
  );

  const deleteCustomQuickAdd = useCallback((id: string) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        customQuickAdds: prev.customQuickAdds.filter((q) => q.id !== id),
      };
      saveNutritionSettings(next);
      return next;
    });
  }, []);

  return { settings, update, addCustomQuickAdd, deleteCustomQuickAdd };
}
