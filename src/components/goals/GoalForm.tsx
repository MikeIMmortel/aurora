import { useState } from 'react';
import type { Goal, GoalField } from '../../types/measurement';
import { GOAL_FIELD_LABELS, GOAL_FIELD_UNITS, GOAL_FIELD_DIRECTIONS } from '../../types/measurement';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  existingFields: GoalField[];
}

const ALL_FIELDS: GoalField[] = [
  'weight',
  'bodyFatPercentage',
  'fatMass',
  'leanMass',
  'circumferences.belly',
  'circumferences.arm',
  'circumferences.upperLeg',
];

export function GoalForm({ onAdd, existingFields }: Props) {
  const availableFields = ALL_FIELDS.filter((f) => !existingFields.includes(f));
  const [field, setField] = useState<GoalField>(availableFields[0] || 'weight');
  const [targetValue, setTargetValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  if (availableFields.length === 0 && !isOpen) {
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(targetValue);
    if (isNaN(value)) return;
    onAdd({
      field,
      targetValue: value,
      unit: GOAL_FIELD_UNITS[field],
      direction: GOAL_FIELD_DIRECTIONS[field],
    });
    setTargetValue('');
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-[14px] transition-colors font-mono uppercase tracking-[0.12em]"
        style={{
          border: '1px dashed var(--color-rule-2)',
          color: 'var(--color-ink-3)',
          background: 'transparent',
          fontSize: 11,
        }}
      >
        <Plus size={14} />
        Doel toevoegen
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-rule)',
        padding: 'var(--pad-card)',
      }}
    >
      <div className="flex-1 flex flex-col gap-1.5">
        <label
          className="font-mono uppercase tracking-[0.12em]"
          style={{ fontSize: 9, color: 'var(--color-ink-3)' }}
        >
          Wat
        </label>
        <select
          value={field}
          onChange={(e) => setField(e.target.value as GoalField)}
          className="rounded-[7px] px-3 py-2 text-sm focus:outline-none"
          style={{
            background: 'var(--color-bg-sunken)',
            border: '1px solid var(--color-rule-2)',
            color: 'var(--color-ink)',
          }}
        >
          {availableFields.map((f) => (
            <option key={f} value={f}>
              {GOAL_FIELD_LABELS[f]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="font-mono uppercase tracking-[0.12em]"
          style={{ fontSize: 9, color: 'var(--color-ink-3)' }}
        >
          Doel ({GOAL_FIELD_UNITS[field]})
        </label>
        <input
          type="number"
          step="0.1"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder="0.0"
          className="w-32 rounded-[7px] px-3 py-2 text-sm focus:outline-none tabular-nums"
          style={{
            background: 'var(--color-bg-sunken)',
            border: '1px solid var(--color-rule-2)',
            color: 'var(--color-ink)',
          }}
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-[7px] font-mono uppercase tracking-[0.08em] transition-colors"
          style={{
            background: 'var(--color-ink)',
            color: 'var(--color-bg)',
            fontSize: 11,
          }}
        >
          Toevoegen
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 rounded-[7px] font-mono uppercase tracking-[0.08em] transition-colors"
          style={{
            border: '1px solid var(--color-rule-2)',
            color: 'var(--color-ink-3)',
            fontSize: 11,
            background: 'transparent',
          }}
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
