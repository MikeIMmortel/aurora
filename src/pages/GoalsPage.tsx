import type { Measurement, Goal, GoalField } from '../types/measurement';
import { GoalForm } from '../components/goals/GoalForm';
import { GoalCard } from '../components/goals/GoalCard';

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
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Doelen</h2>

      <GoalForm onAdd={addGoal} existingFields={existingFields} />

      {goals.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">
          <p>Nog geen doelen ingesteld.</p>
          <p className="text-sm mt-1">Stel een doel in om je voortgang te meten.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
  );
}
