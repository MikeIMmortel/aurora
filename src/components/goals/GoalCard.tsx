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

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-rule)',
  borderRadius: '14px',
  padding: 'var(--pad-card)',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: 22,
  color: 'var(--color-ink)',
  margin: 0,
  lineHeight: 1,
};

const metaStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-ink-3)',
};

export function GoalCard({ goal, first, latest, onDelete }: Props) {
  if (!first || !latest) return null;

  const startValue = getFieldValue(first, goal.field);
  const currentValue = getFieldValue(latest, goal.field);
  const targetValue = goal.targetValue;

  const totalRange = Math.abs(targetValue - startValue);
  const progress =
    totalRange === 0 ? 100 : (Math.abs(currentValue - startValue) / totalRange) * 100;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const isGoalReached =
    goal.direction === 'decrease' ? currentValue <= targetValue : currentValue >= targetValue;

  const remaining =
    goal.direction === 'decrease' ? currentValue - targetValue : targetValue - currentValue;

  return (
    <div style={cardStyle} className="flex flex-col gap-5">
      {/* Header — title + delete */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 style={titleStyle}>{GOAL_FIELD_LABELS[goal.field]}</h4>
          <p style={{ ...metaStyle, marginTop: 8 }}>
            Start {startValue} {goal.unit} · Doel {targetValue} {goal.unit}
          </p>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 -m-2 transition-colors"
          style={{ color: 'var(--color-ink-4)' }}
          aria-label="Verwijderen"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Huidig + remaining */}
      <div className="flex items-baseline justify-between">
        <div>
          <span style={{ ...metaStyle, fontSize: 9 }}>Huidig</span>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              color: 'var(--color-ink)',
              lineHeight: 1,
              marginTop: 4,
            }}
            className="tabular-nums"
          >
            {currentValue.toFixed(1)}
            <span className="font-mono ml-1" style={{ fontSize: 11, color: 'var(--color-ink-3)' }}>
              {goal.unit}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span style={{ ...metaStyle, fontSize: 9, color: isGoalReached ? 'var(--color-positive)' : 'var(--color-ink-3)' }}>
            {isGoalReached ? 'Bereikt' : 'Nog te gaan'}
          </span>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              color: isGoalReached ? 'var(--color-positive)' : 'var(--color-ink-2)',
              lineHeight: 1,
              marginTop: 4,
            }}
            className="tabular-nums"
          >
            {isGoalReached ? '✓' : `${Math.abs(remaining).toFixed(1)} ${goal.unit}`}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-sunken)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${clampedProgress}%`,
              background: isGoalReached ? 'var(--color-positive)' : 'var(--color-aurora-gold)',
            }}
          />
        </div>
        <span
          className="font-mono tabular-nums text-right"
          style={{ fontSize: 10, color: 'var(--color-ink-3)' }}
        >
          {clampedProgress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
