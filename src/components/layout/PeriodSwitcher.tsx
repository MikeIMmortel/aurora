export type Period = '7d' | '30d' | '90d';

interface Props {
  value: Period;
  onChange: (p: Period) => void;
}

const OPTIONS: Period[] = ['7d', '30d', '90d'];

export function PeriodSwitcher({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="inline-flex rounded-full p-[3px] gap-0"
      style={{
        border: '1px solid var(--color-rule-2)',
        background: 'var(--color-bg-card)',
      }}
    >
      {OPTIONS.map((p) => {
        const active = p === value;
        return (
          <button
            key={p}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p)}
            className="font-mono text-[11px] uppercase tracking-[0.06em] px-3 py-[5px] rounded-full transition-colors cursor-pointer"
            style={{
              background: active ? 'var(--color-ink)' : 'transparent',
              color: active ? 'var(--color-bg)' : 'var(--color-ink-3)',
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
