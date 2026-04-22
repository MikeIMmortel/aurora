import type {
  ActivityLevel,
  NutritionGoal,
  NutritionSettings as Settings,
} from '../../types/nutrition';
import {
  ACTIVITY_LABELS,
  GOAL_DESCRIPTIONS,
  GOAL_LABELS,
} from '../../lib/nutrition';

interface Props {
  settings: Settings;
  onChange: (partial: Partial<Settings>) => void;
}

const GOALS: NutritionGoal[] = ['fat-loss', 'recomp', 'muscle-gain'];
const ACTIVITIES: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very-active',
];

export default function NutritionSettings({ settings, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-5">
      <h3 className="text-lg font-semibold text-white">Instellingen</h3>

      <Field label="Doel">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => onChange({ goal })}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                settings.goal === goal
                  ? 'border-aurora-gold bg-aurora-gold/10 text-aurora-gold-light'
                  : 'border-aurora-border text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="font-medium">{GOAL_LABELS[goal]}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">{GOAL_DESCRIPTIONS[settings.goal]}</p>
      </Field>

      <Field label="Activiteitsniveau">
        <select
          value={settings.activity}
          onChange={(e) => onChange({ activity: e.target.value as ActivityLevel })}
          className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
        >
          {ACTIVITIES.map((a) => (
            <option key={a} value={a}>
              {ACTIVITY_LABELS[a]}
            </option>
          ))}
        </select>
      </Field>

      <details className="text-sm">
        <summary className="cursor-pointer text-gray-400 hover:text-gray-200 select-none">
          Geavanceerd
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label={`Eiwit (${settings.proteinPerKg.toFixed(1)} g/kg)`}>
            <input
              type="range"
              min="1.4"
              max="2.5"
              step="0.1"
              value={settings.proteinPerKg}
              onChange={(e) => onChange({ proteinPerKg: parseFloat(e.target.value) })}
              className="w-full accent-aurora-gold"
            />
          </Field>
          <Field label={`Vet (${settings.fatPerKg.toFixed(1)} g/kg)`}>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.1"
              value={settings.fatPerKg}
              onChange={(e) => onChange({ fatPerKg: parseFloat(e.target.value) })}
              className="w-full accent-aurora-gold"
            />
          </Field>
        </div>
      </details>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}
