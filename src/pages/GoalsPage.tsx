import type { Measurement, Goal, GoalField } from '../types/measurement';
import { GoalForm } from '../components/goals/GoalForm';
import { GoalCard } from '../components/goals/GoalCard';
import { PageHeader, pageContainerStyle } from '../components/layout/PageHeader';

interface Props {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  measurements: Measurement[];
  getFirst: () => Measurement | null;
  getLatest: () => Measurement | null;
}

export function GoalsPage({ goals, addGoal, deleteGoal, getFirst, getLatest }: Props) {
  const first = getFirst();
  const latest = getLatest();
  const existingFields = goals.map((g) => g.field as GoalField);

  return (
    <div style={pageContainerStyle}>
      <PageHeader
        title="Doe"
        emphasized="len"
        meta={`${goals.length} ${goals.length === 1 ? 'doel' : 'doelen'} ingesteld`}
      />

      <div className="max-w-2xl space-y-5">
        <GoalForm onAdd={addGoal} existingFields={existingFields} />

        {goals.length === 0 ? (
          <div className="py-12 text-center" style={{ color: 'var(--color-ink-3)' }}>
            <p
              className="font-display italic"
              style={{ fontSize: '20px', color: 'var(--color-ink-2)' }}
            >
              Nog geen doelen ingesteld.
            </p>
            <p
              className="font-mono uppercase tracking-[0.12em] text-[10px] mt-2"
              style={{ color: 'var(--color-ink-3)' }}
            >
              Stel een doel in om je voortgang te meten
            </p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: 'var(--gap-grid)' }}>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                first={first}
                latest={latest}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
