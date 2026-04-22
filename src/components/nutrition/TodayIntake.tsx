import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import type { QuickAdd } from '../../types/nutrition';

interface Props {
  currentProtein: number;
  proteinTarget: number;
  currentKcal: number;
  kcalTarget: number;
  quickAdds: QuickAdd[];
  onAddEntry: (entry: { proteinG?: number; kcal?: number }) => void;
  onSetProtein: (g: number) => void;
  onSetKcal: (kcal: number) => void;
  onReset: () => void;
}

function ProgressRow({
  label,
  current,
  target,
  unit,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const status = pct >= 95 ? 'green' : pct >= 70 ? 'amber' : current > 0 ? 'red' : 'neutral';
  const barColor =
    status === 'green'
      ? 'bg-[#4ADE80]'
      : status === 'amber'
        ? 'bg-aurora-gold'
        : status === 'red'
          ? 'bg-[#F87171]'
          : 'bg-gray-600';

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
        <span className="text-sm tabular-nums">
          <span className="text-white font-semibold">{Math.round(current)}</span>
          <span className="text-gray-500"> / {target} {unit}</span>
          <span className="text-gray-600 ml-2">{pct}%</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-aurora-black overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function TodayIntake({
  currentProtein,
  proteinTarget,
  currentKcal,
  kcalTarget,
  quickAdds,
  onAddEntry,
  onSetProtein,
  onSetKcal,
  onReset,
}: Props) {
  const [customProtein, setCustomProtein] = useState('');
  const [customKcal, setCustomKcal] = useState('');

  const submitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(customProtein.replace(',', '.'));
    const k = parseFloat(customKcal.replace(',', '.'));
    const entry: { proteinG?: number; kcal?: number } = {};
    if (!isNaN(p) && p !== 0) entry.proteinG = p;
    if (!isNaN(k) && k !== 0) entry.kcal = k;
    if (entry.proteinG !== undefined || entry.kcal !== undefined) {
      onAddEntry(entry);
      setCustomProtein('');
      setCustomKcal('');
    }
  };

  return (
    <div className="rounded-2xl border border-aurora-gold/60 bg-aurora-surface p-5 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Vandaag</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Tap een snel-knop na elke maaltijd — eiwit en kcal worden samen gelogd
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Vandaag resetten?')) onReset();
          }}
          className="text-gray-500 hover:text-gray-300 p-2 -m-2"
          title="Vandaag resetten"
          aria-label="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <ProgressRow
          label="Eiwit"
          current={currentProtein}
          target={proteinTarget}
          unit="g"
        />
        <ProgressRow
          label="Kcal"
          current={currentKcal}
          target={kcalTarget}
          unit="kcal"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Snel toevoegen</p>
        <div className="flex flex-wrap gap-2">
          {quickAdds.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onAddEntry({ proteinG: q.proteinG, kcal: q.kcal })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                q.id.startsWith('custom-')
                  ? 'border-aurora-gold/40 bg-aurora-gold/5 hover:border-aurora-gold'
                  : 'border-aurora-border bg-aurora-black/40 hover:border-aurora-gold'
              }`}
              title={`${q.portion} · +${q.proteinG} g eiwit · +${q.kcal} kcal`}
            >
              <Plus size={12} className="text-aurora-gold" />
              <span className="text-white font-medium">{q.label}</span>
              <span className="text-gray-500 text-xs hidden sm:inline">
                +{q.proteinG}g · {q.kcal}kcal
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submitCustom} className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[100px]">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">
            Eiwit (g)
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={customProtein}
            onChange={(e) => setCustomProtein(e.target.value)}
            className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
          />
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">
            Kcal
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={customKcal}
            onChange={(e) => setCustomKcal(e.target.value)}
            className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-aurora-gold/20 border border-aurora-gold/40 text-aurora-gold-light hover:bg-aurora-gold/30 text-sm font-medium whitespace-nowrap"
        >
          + Toevoegen
        </button>
      </form>

      <div className="flex gap-2 text-xs text-gray-500">
        <button
          type="button"
          onClick={() => {
            const v = prompt('Eiwit-totaal zetten (g):', String(currentProtein));
            if (v !== null) {
              const n = parseFloat(v.replace(',', '.'));
              if (!isNaN(n)) onSetProtein(n);
            }
          }}
          className="hover:text-gray-300"
        >
          Eiwit-totaal zetten
        </button>
        <span className="text-gray-700">·</span>
        <button
          type="button"
          onClick={() => {
            const v = prompt('Kcal-totaal zetten:', String(currentKcal));
            if (v !== null) {
              const n = parseFloat(v.replace(',', '.'));
              if (!isNaN(n)) onSetKcal(n);
            }
          }}
          className="hover:text-gray-300"
        >
          Kcal-totaal zetten
        </button>
      </div>
    </div>
  );
}
