import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { QuickAdd } from '../../types/nutrition';

interface Props {
  items: QuickAdd[];
  onAdd: (item: Omit<QuickAdd, 'id'>) => void;
  onDelete: (id: string) => void;
}

export default function CustomQuickAdds({ items, onAdd, onDelete }: Props) {
  const [label, setLabel] = useState('');
  const [portion, setPortion] = useState('');
  const [proteinG, setProteinG] = useState('');
  const [kcal, setKcal] = useState('');

  const canSubmit =
    label.trim().length > 0 &&
    !isNaN(parseFloat(proteinG.replace(',', '.'))) &&
    !isNaN(parseFloat(kcal.replace(',', '.')));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd({
      label: label.trim(),
      portion: portion.trim(),
      proteinG: parseFloat(proteinG.replace(',', '.')),
      kcal: parseFloat(kcal.replace(',', '.')),
    });
    setLabel('');
    setPortion('');
    setProteinG('');
    setKcal('');
  };

  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-ink">Mijn snel-knoppen</h3>
        <p className="text-xs text-ink-3 mt-0.5">
          Voeg je eigen gerechten toe zodat je ze met 1 tap kunt loggen
        </p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col divide-y divide-aurora-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">
                  {item.label}
                </div>
                {item.portion && (
                  <div className="text-xs text-ink-3 truncate">{item.portion}</div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-positive">
                  {item.proteinG} g
                </div>
                <div className="text-xs text-ink-3">{item.kcal} kcal</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`"${item.label}" verwijderen?`)) onDelete(item.id);
                }}
                className="text-ink-4 hover:text-negative p-2"
                aria-label="Verwijderen"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
        <div className="col-span-2 sm:col-span-1">
          <label className="text-[10px] uppercase tracking-wider text-ink-3 block mb-1">
            Naam
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="bv. Havermout"
            className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-[10px] uppercase tracking-wider text-ink-3 block mb-1">
            Portie
          </label>
          <input
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
            placeholder="bv. 50 g"
            className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ink-3 block mb-1">
            Eiwit (g)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={proteinG}
            onChange={(e) => setProteinG(e.target.value)}
            placeholder="0"
            className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ink-3 block mb-1">
            Kcal
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={kcal}
            onChange={(e) => setKcal(e.target.value)}
            placeholder="0"
            className="w-full bg-aurora-black border border-aurora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-gold"
          />
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="col-span-2 sm:col-span-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-aurora-gold/20 border border-aurora-gold/40 text-aurora-gold-light hover:bg-aurora-gold/30 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          <Plus size={14} />
          Knop toevoegen
        </button>
      </form>
    </div>
  );
}
