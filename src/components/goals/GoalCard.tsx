import type { Goal, Measurement } from '../../types/measurement';
import { GOAL_FIELD_LABELS } from '../../types/measurement';
import { getFieldValue } from '../../lib/utils';
import { Trash2 } from 'lucide-react';

interface Props {
  goal: Goal;
  first: Measurement | null;
  latest: Measurement | null;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, first, latest, onDelete }: Props) {
  if (!first || !latest) return null;

  const startValue = getFieldValue(first, goal.field);
  const currentValue = getFieldValue(latest, goal.field);
  const targetValue = goal.targetValue;

  const totalRange = Math.abs(targetValue - startValue);
  const progress = totalRange === 0 ? 100 : Math.abs(currentValue - startValue) / totalRange * 100;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const isGoalReached = goal.direction === 'decrease'
    ? currentValue <= targetValue
    : currentValue >= targetValue;

  const remaining = goal.direction === 'decrease'
    ? currentValue - targetValue
    : targetValue - currentValue;

  return (
    <div className="bg-aurora-surface border border-aurora-border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{GOAL_FIELD_LABELS[goal.field]}</h4>
          <p className="text-sm text-ink-3">
            Doel: {targetValue} {goal.unit} | Huidig: {currentValue} {goal.unit}
          </p>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-ink-3 hover:text-negative transition-colors p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-ink-3">
          <span>Start: {startValue} {goal.unit}</span>
          <span>{isGoalReached ? 'Bereikt!' : `Nog ${Math.abs(remaining).toFixed(1)} ${goal.unit} te gaan`}</span>
        </div>
        <div className="h-3 bg-aurora-black rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached ? 'bg-positive' : 'bg-aurora-gold'
            }`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <div className="text-right text-xs text-ink-3">
          {clampedProgress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
