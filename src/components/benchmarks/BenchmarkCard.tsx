import type { Benchmark } from '../../lib/benchmarks';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../lib/benchmarks';

interface Props {
  benchmark: Benchmark;
}

const CARD_STYLE: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-rule)',
  borderRadius: '14px',
  padding: 'var(--pad-card)',
};

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: '22px',
  color: 'var(--color-ink)',
  margin: 0,
  lineHeight: 1,
  letterSpacing: '-0.005em',
};

const META_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10.5px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-ink-3)',
};

const VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '32px',
  color: 'var(--color-ink)',
  lineHeight: 1,
};

const IDEAL_VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '20px',
  color: 'var(--color-aurora-gold)',
  lineHeight: 1,
};

/**
 * Visuele spectrum-balk met categorieën als segmenten.
 * Vertical layout (top → bottom):
 *   1. Threshold labels rij (klein, mono uppercase)
 *   2. Spacing
 *   3. Bar (4px) met ideaal-vlag boven en jij-pin onder als ankers
 *   4. Spacing
 *   5. Jij-waarde caption
 *
 * De ideaal-vlag wordt boven de bar gepositioneerd; threshold labels
 * staan veilig erboven zodat ze niet overlappen met de markers.
 */
function CategorySpectrum({ benchmark }: { benchmark: Benchmark }) {
  const { axisMin, axisMax, thresholds, value, ideal } = benchmark;
  const range = axisMax - axisMin;

  const segments = thresholds.map((t, i) => {
    const start = Math.max(t.from, axisMin);
    const end = i < thresholds.length - 1 ? thresholds[i + 1].from : axisMax;
    const startPct = ((start - axisMin) / range) * 100;
    const widthPct = ((Math.min(end, axisMax) - start) / range) * 100;
    return {
      startPct,
      widthPct,
      color: CATEGORY_COLORS[t.category],
      label: t.label,
    };
  });

  const valuePct = Math.max(0, Math.min(100, ((value - axisMin) / range) * 100));
  const idealPct = Math.max(0, Math.min(100, ((ideal - axisMin) / range) * 100));

  return (
    <div className="flex flex-col gap-2">
      {/* Threshold labels — bovenaan, ver weg van markers */}
      <div className="relative h-3.5">
        {segments.map((seg, i) => {
          if (!seg.label) return null;
          const center = seg.startPct + seg.widthPct / 2;
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 whitespace-nowrap font-mono uppercase tracking-[0.1em]"
              style={{
                left: `${center}%`,
                fontSize: 8.5,
                color: 'var(--color-ink-3)',
              }}
            >
              {seg.label}
            </span>
          );
        })}
      </div>

      {/* Bar met ideaal-vlag boven en jij-marker onder */}
      <div className="relative" style={{ paddingTop: 12, paddingBottom: 18 }}>
        {/* Ideaal-vlag (gouden driehoek wijst naar bar) */}
        <div
          className="absolute -translate-x-1/2"
          style={{ top: 0, left: `${idealPct}%` }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '6px solid var(--color-aurora-gold)',
              transform: 'translateX(-5px)',
            }}
          />
        </div>

        {/* De bar zelf */}
        <div
          className="h-1.5 rounded-full overflow-hidden flex"
          style={{ background: 'var(--color-bg-sunken)' }}
        >
          {segments.map((seg, i) => (
            <div
              key={i}
              style={{
                width: `${seg.widthPct}%`,
                backgroundColor: seg.color,
                opacity: 0.75,
              }}
            />
          ))}
        </div>

        {/* Jij-pin (ink driehoek wijst naar bar) */}
        <div
          className="absolute -translate-x-1/2"
          style={{ bottom: 6, left: `${valuePct}%` }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '6px solid var(--color-ink)',
              transform: 'translateX(-5px)',
            }}
          />
        </div>
      </div>

      {/* Legenda onder de bar — tweekoloms */}
      <div
        className="flex items-center justify-between font-mono uppercase tracking-[0.1em]"
        style={{ fontSize: 9, color: 'var(--color-ink-3)' }}
      >
        <span className="flex items-center gap-1.5">
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: '3px solid transparent',
              borderRight: '3px solid transparent',
              borderBottom: '4px solid var(--color-ink)',
            }}
          />
          Jij
        </span>
        <span className="flex items-center gap-1.5">
          Ideaal
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: '3px solid transparent',
              borderRight: '3px solid transparent',
              borderTop: '4px solid var(--color-aurora-gold)',
            }}
          />
        </span>
      </div>
    </div>
  );
}

function formatValue(v: number, unit: string): string {
  if (unit === '%') return v.toFixed(1);
  if (v < 10) return v.toFixed(2);
  return v.toFixed(1);
}

export default function BenchmarkCard({ benchmark }: Props) {
  const color = CATEGORY_COLORS[benchmark.category];
  const label = CATEGORY_LABELS[benchmark.category];

  const lowerIsBetter = ['bodyFat', 'waist', 'waistToHeight', 'skinfold'].includes(benchmark.key);
  const isFFMI = benchmark.key === 'ffmi';

  let deltaText: string;
  let deltaColor: string;
  if (Math.abs(benchmark.deltaToIdeal) < 0.05) {
    deltaText = 'Op het ideaal';
    deltaColor = 'var(--color-positive)';
  } else if (lowerIsBetter) {
    if (benchmark.deltaToIdeal < 0) {
      deltaText = `${Math.abs(benchmark.deltaToIdeal).toFixed(1)} ${benchmark.unit} onder ideaal`;
      deltaColor = 'var(--color-positive)';
    } else {
      deltaText = `${benchmark.deltaToIdeal.toFixed(1)} ${benchmark.unit} boven ideaal`;
      deltaColor = 'var(--color-aurora-gold)';
    }
  } else if (isFFMI) {
    if (benchmark.deltaToIdeal >= 0) {
      deltaText = `${benchmark.deltaToIdeal.toFixed(1)} boven ideaal`;
      deltaColor = 'var(--color-positive)';
    } else {
      deltaText = `${Math.abs(benchmark.deltaToIdeal).toFixed(1)} onder ideaal`;
      deltaColor = 'var(--color-aurora-gold)';
    }
  } else {
    deltaText =
      benchmark.deltaToIdeal > 0
        ? `${benchmark.deltaToIdeal.toFixed(1)} boven ideaal`
        : `${Math.abs(benchmark.deltaToIdeal).toFixed(1)} onder ideaal`;
    deltaColor = 'var(--color-aurora-gold)';
  }

  return (
    <div style={CARD_STYLE} className="flex flex-col gap-5">
      {/* Header — title + meta */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 style={TITLE_STYLE}>{benchmark.metric}</h3>
          <p style={{ ...META_STYLE, marginTop: 6 }}>{benchmark.description}</p>
        </div>
        <span className="font-mono uppercase tracking-[0.14em] shrink-0" style={{ fontSize: 10, color, fontWeight: 600 }}>
          {label}
        </span>
      </div>

      {/* Value pair: Ideaal | Jij */}
      <div
        className="grid items-end gap-4 pb-4"
        style={{
          gridTemplateColumns: 'auto 1fr',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <div className="flex flex-col gap-1">
          <span style={{ ...META_STYLE, color: 'var(--color-aurora-gold)', fontSize: 9 }}>Ideaal</span>
          <span style={IDEAL_VALUE_STYLE} className="tabular-nums">
            {formatValue(benchmark.ideal, benchmark.unit)}
            {benchmark.unit && (
              <span className="font-mono ml-1" style={{ fontSize: 11, color: 'var(--color-aurora-gold)' }}>
                {benchmark.unit}
              </span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span style={{ ...META_STYLE, fontSize: 9 }}>Jij</span>
          <span style={VALUE_STYLE} className="tabular-nums">
            {formatValue(benchmark.value, benchmark.unit)}
            {benchmark.unit && (
              <span className="font-mono ml-1" style={{ fontSize: 12, color: 'var(--color-ink-3)' }}>
                {benchmark.unit}
              </span>
            )}
          </span>
        </div>
      </div>

      <CategorySpectrum benchmark={benchmark} />

      <div
        className="font-mono text-[11px] tabular-nums"
        style={{ color: deltaColor }}
      >
        {deltaText}
      </div>

      <div
        className="text-[12px] leading-relaxed"
        style={{
          color: 'var(--color-ink-3)',
          paddingTop: 12,
          borderTop: '1px solid var(--color-rule)',
        }}
      >
        <div className="mb-1">
          <span style={{ color: 'var(--color-ink-2)', fontWeight: 500 }}>Waarom dit ideaal:</span>{' '}
          {benchmark.idealNote}
        </div>
        {benchmark.context}
        <div
          className="mt-1.5 italic font-mono"
          style={{ color: 'var(--color-ink-4)', fontSize: 10 }}
        >
          Bron: {benchmark.source}
        </div>
      </div>
    </div>
  );
}
