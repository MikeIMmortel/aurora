import { useState } from 'react';
import type { Goal, GoalField } from '../../types/measurement';
import { GOAL_FIELD_LABELS, GOAL_FIELD_UNITS, GOAL_FIELD_DIRECTIONS } from '../../types/measurement';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  existingFields: GoalField[];
}

const ALL_FIELDS: GoalField[] = [
  'weight', 'bodyFatPercentage', 'fatMass', 'leanMass',
  'circumferences.belly', 'circumferences.arm', 'circumferences.upperLeg',
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
        className="flex items-center gap-2 px-4 py-2 border border-dashed border-aurora-border rounded-lg text-gray-400 hover:text-aurora-gold hover:border-aurora-gold/50 transition-colors"
      >
        <Plus size={16} />
        Doel toevoegen
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-aurora-surface border border-aurora-border rounded-xl p-4 flex flex-col sm:flex-row gap-3">
      <select
        value={field}
        onChange={(e) => setField(e.target.value as GoalField)}
        className="bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:border-aurora-gold focus:outline-none"
      >
        {availableFields.map((f) => (
          <option key={f} value={f}>{GOAL_FIELD_LABELS[f]}</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.1"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder={`Doel (${GOAL_FIELD_UNITS[field]})`}
          className="w-32 bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:border-aurora-gold focus:outline-none"
          required
        />
        <span className="text-gray-400 text-sm">{GOAL_FIELD_UNITS[field]}</span>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-aurora-gold text-aurora-black rounded-lg font-medium text-sm hover:bg-aurora-gold-light transition-colors"
        >
          Toevoegen
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 border border-aurora-border rounded-lg text-gray-400 text-sm hover:text-gray-200 transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
