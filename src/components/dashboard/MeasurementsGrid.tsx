import type { Measurement } from '../../types/measurement';

interface Props {
  latest: Measurement;
  previous: Measurement | null;
}

interface Cell {
  label: string;
  value: number;
  unit: string;
  delta: number | null;
  /** 'decrease' = lager is beter (vet, omtrek), 'increase' = hoger is beter (spier-omtrek) */
  goodDirection: 'decrease' | 'increase';
}

function buildCells(latest: Measurement, previous: Measurement | null): Cell[] {
  const d = (curr: number, prev: number | undefined): number | null =>
    prev === undefined ? null : curr - prev;

  return [
    {
      label: 'Buik',
      value: latest.circumferences.belly,
      unit: 'cm',
      delta: d(latest.circumferences.belly, previous?.circumferences.belly),
      goodDirection: 'decrease',
    },
    {
      label: 'Arm',
      value: latest.circumferences.arm,
      unit: 'cm',
      delta: d(latest.circumferences.arm, previous?.circumferences.arm),
      goodDirection: 'increase',
    },
    {
      label: 'Bovenbeen',
      value: latest.circumferences.upperLeg,
      unit: 'cm',
      delta: d(latest.circumferences.upperLeg, previous?.circumferences.upperLeg),
      goodDirection: 'increase',
    },
    {
      label: 'Borst (plooi)',
      value: latest.skinfolds.chest,
      unit: 'mm',
      delta: d(latest.skinfolds.chest, previous?.skinfolds.chest),
      goodDirection: 'decrease',
    },
    {
      label: 'Suprailiac',
      value: latest.skinfolds.suprailiac,
      unit: 'mm',
      delta: d(latest.skinfolds.suprailiac, previous?.skinfolds.suprailiac),
      goodDirection: 'decrease',
    },
    {
      label: 'Triceps',
      value: latest.skinfolds.triceps,
      unit: 'mm',
      delta: d(latest.skinfolds.triceps, previous?.skinfolds.triceps),
      goodDirection: 'decrease',
    },
  ];
}

function signed(n: number): string {
  const s = n.toFixed(1);
  return n > 0 ? `+${s}` : s;
}

export function MeasurementsGrid({ latest, previous }: Props) {
  const cells = buildCells(latest, previous);

  return (
    <section
      className="rounded-[14px] overflow-hidden"
      style={{
        border: '1px solid var(--color-rule)',
      }}
    >
      <div
        className="flex items-baseline justify-between"
        style={{
          padding: 'var(--pad-card)',
          paddingBottom: 0,
          background: 'var(--color-bg-card)',
        }}
      >
        <h3
          className="font-display italic text-[22px] m-0"
          style={{ color: 'var(--color-ink)' }}
        >
          Lichaamsmaten
        </h3>
        <span
          className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-ink-3)' }}
        >
          Δ vs vorige meting
        </span>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--color-rule)',
          padding: '1px',
          marginTop: 'var(--pad-card)',
        }}
      >
        {cells.map((cell) => {
          const isGood =
            cell.delta !== null && Math.abs(cell.delta) > 0.05
              ? cell.goodDirection === 'decrease'
                ? cell.delta < 0
                : cell.delta > 0
              : null;
          const deltaColor =
            isGood === null
              ? 'var(--color-ink-3)'
              : isGood
                ? 'var(--color-positive)'
                : 'var(--color-negative)';
          return (
            <div
              key={cell.label}
              className="flex flex-col gap-2"
              style={{
                background: 'var(--color-bg-card)',
                padding: '16px 18px',
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ color: 'var(--color-ink-3)' }}
              >
                {cell.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display tabular-nums text-[28px] leading-none"
                  style={{ color: 'var(--color-ink)' }}
                >
                  {cell.value.toFixed(1)}
                </span>
                <span
                  className="font-mono text-[10px] uppercase"
                  style={{ color: 'var(--color-ink-3)' }}
                >
                  {cell.unit}
                </span>
              </div>
              <span
                className="font-mono text-[10.5px] tabular-nums"
                style={{ color: deltaColor }}
              >
                {cell.delta === null ? '—' : `${signed(cell.delta)} ${cell.unit}`}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
