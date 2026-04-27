import type { Measurement } from '../../types/measurement';
import { calculateBMI } from '../../lib/utils';

interface Props {
  latest: Measurement;
  weekAgo: Measurement | null;
  monthAgo: Measurement | null;
}

function signed(n: number, digits = 1): string {
  const s = n.toFixed(digits);
  return n > 0 ? `+${s}` : s;
}

interface BarRowProps {
  label: string;
  value: number;
  /** Visuele schaal voor de balk-breedte (niet 1:1 percentage) */
  visualPct: number;
  variant: 'muscle' | 'fat' | 'water';
}

function BarRow({ label, value, visualPct, variant }: BarRowProps) {
  const fillColor =
    variant === 'muscle'
      ? 'var(--color-aurora-gold)'
      : variant === 'fat'
        ? 'var(--color-negative)'
        : 'var(--color-ink-3)';

  return (
    <div className="grid items-center gap-3" style={{ gridTemplateColumns: '70px 1fr auto' }}>
      <span
        className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
        style={{ color: 'var(--color-ink-3)' }}
      >
        {label}
      </span>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--color-bg-sunken)' }}
      >
        <div
          className="h-full transition-[width] duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, visualPct))}%`,
            background: fillColor,
            borderRadius: '999px',
          }}
        />
      </div>
      <span className="font-display text-[18px]" style={{ color: 'var(--color-ink)' }}>
        {value.toFixed(1)}
        <sub className="font-mono text-[10px] ml-0.5" style={{ color: 'var(--color-ink-3)' }}>
          %
        </sub>
      </span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="rounded-[14px]"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-rule)',
        padding: 'var(--pad-card)',
      }}
    >
      {children}
    </section>
  );
}

export function Hero({ latest, weekAgo, monthAgo }: Props) {
  const bmi = calculateBMI(latest.weight, latest.height);
  const weightDelta7 = weekAgo ? latest.weight - weekAgo.weight : null;
  const weightDelta30 = monthAgo ? latest.weight - monthAgo.weight : null;

  const musclePct = (latest.leanMass / latest.weight) * 100;
  const fatPct = latest.bodyFatPercentage;

  return (
    <Card>
      {/* Card header */}
      <div className="flex items-baseline justify-between mb-6">
        <h3
          className="font-display italic text-[22px] m-0"
          style={{ color: 'var(--color-ink)' }}
        >
          Vandaag
        </h3>
        <span
          className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-ink-3)' }}
        >
          Index · Spier · Vet
        </span>
      </div>

      {/* Hero grid */}
      <div className="grid gap-8" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Links: gewicht + deltas */}
        <div className="flex flex-col gap-4">
          <div
            className="font-mono text-[10.5px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--color-ink-3)' }}
          >
            Lichaamsgewicht
          </div>
          <div className="flex items-baseline gap-2 leading-none">
            <span
              className="font-display tabular-nums"
              style={{
                fontSize: 'clamp(72px, 12vw, 112px)',
                color: 'var(--color-ink)',
                lineHeight: 0.9,
              }}
            >
              {latest.weight.toFixed(1)}
            </span>
            <span
              className="font-mono text-[13px] uppercase tracking-[0.14em]"
              style={{ color: 'var(--color-ink-3)' }}
            >
              kg
            </span>
          </div>

          <div
            className="grid gap-6 pt-4 mt-2"
            style={{
              gridTemplateColumns: 'repeat(3, auto)',
              borderTop: '1px solid var(--color-rule)',
            }}
          >
            <DeltaCell label="7 dagen" value={weightDelta7} lowerIsBetter />
            <DeltaCell label="30 dagen" value={weightDelta30} lowerIsBetter />
            <DeltaCell label="BMI" value={bmi} format={(v) => v.toFixed(1)} />
          </div>
        </div>

        {/* Rechts: samenstelling */}
        <div
          className="flex flex-col gap-4 pl-7"
          style={{ borderLeft: '1px solid var(--color-rule)' }}
        >
          <div
            className="font-mono text-[10.5px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--color-ink-3)' }}
          >
            Samenstelling
          </div>
          <div className="flex flex-col gap-3">
            <BarRow
              label="Spier"
              value={musclePct}
              visualPct={musclePct * 1.6}
              variant="muscle"
            />
            <BarRow
              label="Vet"
              value={fatPct}
              visualPct={fatPct * 2.5}
              variant="fat"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

interface DeltaCellProps {
  label: string;
  value: number | null;
  lowerIsBetter?: boolean;
  format?: (v: number) => string;
}

function DeltaCell({ label, value, lowerIsBetter = false, format }: DeltaCellProps) {
  let display = '—';
  let color: string = 'var(--color-ink)';

  if (value !== null) {
    if (format) {
      display = format(value);
    } else {
      display = signed(value);
      if (Math.abs(value) > 0.05) {
        const isGood = lowerIsBetter ? value < 0 : value > 0;
        color = isGood ? 'var(--color-positive)' : 'var(--color-negative)';
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: 'var(--color-ink-3)' }}
      >
        {label}
      </span>
      <span
        className="font-display tabular-nums text-[22px] leading-none"
        style={{ color }}
      >
        {display}
      </span>
    </div>
  );
}
