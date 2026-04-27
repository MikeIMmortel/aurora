import type { Benchmark } from '../../lib/benchmarks';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../lib/benchmarks';

interface Props {
  benchmark: Benchmark;
}

/** Visuele spectrum-balk met categorieën als segmenten, jouw waarde als witte pin, ideaal als gouden vlag */
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
    <div className="relative pt-5">
      {/* Ideaal-marker BOVEN de balk (gouden vlag, naar beneden wijzend) */}
      <div
        className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
        style={{ left: `${idealPct}%` }}
      >
        <span className="text-[9px] uppercase tracking-wider text-aurora-gold font-bold">
          ideaal
        </span>
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-aurora-gold" />
      </div>

      {/* Spectrum balk */}
      <div className="h-2 rounded-full overflow-hidden flex bg-aurora-black">
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              width: `${seg.widthPct}%`,
              backgroundColor: seg.color,
              opacity: 0.55,
            }}
          />
        ))}
      </div>

      {/* Jouw waarde ONDER de balk als witte pin (naar boven wijzend) */}
      <div
        className="absolute -translate-x-1/2 flex flex-col items-center"
        style={{ left: `${valuePct}%`, top: '20px' }}
      >
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-white" />
        <span className="text-[9px] uppercase tracking-wider text-ink font-bold mt-0.5">
          jij
        </span>
      </div>

      {/* Threshold labels onder de balk */}
      <div className="relative h-4 mt-7 text-[10px] text-ink-3">
        {segments.map((seg, i) => {
          if (!seg.label) return null;
          const center = seg.startPct + seg.widthPct / 2;
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${center}%` }}
            >
              {seg.label}
            </span>
          );
        })}
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

  // Bepaal of jij voor of voorbij ideaal staat (afhankelijk van metriek-richting:
  // Voor BF/buik/skinfold/wHt is lager beter; voor FFMI is hoger beter; BMI is bidirectioneel)
  const lowerIsBetter = ['bodyFat', 'waist', 'waistToHeight', 'skinfold'].includes(benchmark.key);
  const isFFMI = benchmark.key === 'ffmi';

  let deltaText: string;
  let deltaColor: string;
  if (Math.abs(benchmark.deltaToIdeal) < 0.05) {
    deltaText = 'Op het ideaal';
    deltaColor = '#4ADE80';
  } else if (lowerIsBetter) {
    if (benchmark.deltaToIdeal < 0) {
      deltaText = `${Math.abs(benchmark.deltaToIdeal).toFixed(1)} ${benchmark.unit} onder ideaal — top`;
      deltaColor = '#4ADE80';
    } else {
      deltaText = `${benchmark.deltaToIdeal.toFixed(1)} ${benchmark.unit} boven ideaal`;
      deltaColor = '#C8A55C';
    }
  } else if (isFFMI) {
    if (benchmark.deltaToIdeal >= 0) {
      deltaText = `${benchmark.deltaToIdeal.toFixed(1)} boven ideaal — top`;
      deltaColor = '#4ADE80';
    } else {
      deltaText = `${Math.abs(benchmark.deltaToIdeal).toFixed(1)} onder ideaal`;
      deltaColor = '#C8A55C';
    }
  } else {
    // BMI — bi-directioneel
    deltaText = benchmark.deltaToIdeal > 0
      ? `${benchmark.deltaToIdeal.toFixed(1)} boven ideaal`
      : `${Math.abs(benchmark.deltaToIdeal).toFixed(1)} onder ideaal`;
    deltaColor = '#C8A55C';
  }

  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-ink">{benchmark.metric}</h3>
          <p className="text-xs text-ink-3 mt-0.5">{benchmark.description}</p>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end">
          <div className="flex items-baseline gap-3">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-aurora-gold font-bold">Ideaal</div>
              <div className="text-base font-semibold text-aurora-gold tabular-nums">
                {formatValue(benchmark.ideal, benchmark.unit)}
                {benchmark.unit && <span className="text-xs ml-0.5">{benchmark.unit}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-ink/60 font-bold">Jij</div>
              <div className="text-2xl font-bold tabular-nums text-ink">
                {formatValue(benchmark.value, benchmark.unit)}
                {benchmark.unit && <span className="text-sm text-ink-3 ml-1">{benchmark.unit}</span>}
              </div>
            </div>
          </div>
          <div
            className="text-xs font-semibold uppercase tracking-wider mt-0.5"
            style={{ color }}
          >
            {label}
          </div>
        </div>
      </div>

      <CategorySpectrum benchmark={benchmark} />

      <div
        className="text-xs font-medium tabular-nums"
        style={{ color: deltaColor }}
      >
        {deltaText}
      </div>

      <div className="text-xs text-ink-3 leading-relaxed pt-2 border-t border-aurora-border/50">
        <div className="mb-1">
          <span className="text-aurora-gold-light font-medium">Waarom dit ideaal:</span>{' '}
          {benchmark.idealNote}
        </div>
        {benchmark.context}
        <div className="text-ink-4 mt-1 italic">Bron: {benchmark.source}</div>
      </div>
    </div>
  );
}
