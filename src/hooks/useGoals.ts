import { useState, useCallback } from 'react';
import type { Goal } from '../types/measurement';
import { loadGoals, saveGoals } from '../lib/storage';
import { generateId } from '../lib/utils';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals((prev) => {
      const newGoal: Goal = {
        ...goal,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...prev, newGoal];
      saveGoals(updated);
      return updated;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      saveGoals(updated);
      return updated;
    });
  }, []);

  return { goals, addGoal, deleteGoal };
}
