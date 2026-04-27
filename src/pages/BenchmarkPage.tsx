import type { Measurement } from '../types/measurement';
import {
  buildBenchmarks,
  summarizeBenchmarks,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../lib/benchmarks';
import BenchmarkCard from '../components/benchmarks/BenchmarkCard';
import {
  PageHeader,
  pageContainerStyle,
  pageCardStyle,
  cardTitleStyle,
} from '../components/layout/PageHeader';
import { formatDate } from '../lib/utils';

interface Props {
  measurements: Measurement[];
}

export function BenchmarkPage({ measurements }: Props) {
  const latest = measurements[measurements.length - 1];

  if (!latest) {
    return (
      <div style={pageContainerStyle}>
        <div className="flex items-center justify-center h-64">
          <p style={{ color: 'var(--color-ink-3)' }}>
            Geen metingen gevonden. Importeer eerst een PDF om benchmarks te zien.
          </p>
        </div>
      </div>
    );
  }

  const benchmarks = buildBenchmarks(latest);
  const summary = summarizeBenchmarks(benchmarks);

  return (
    <div style={pageContainerStyle}>
      <PageHeader
        title="Bench"
        emphasized="mark"
        meta={`Mannen · ${latest.age} jaar · ${latest.height} cm · meting ${formatDate(latest.date)}`}
      />

      {/* Hero summary */}
      <div
        className="rounded-[14px] p-7 flex flex-col gap-3 mb-6"
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-rule)',
          borderLeftWidth: '3px',
          borderLeftColor: CATEGORY_COLORS[summary.level],
        }}
      >
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono uppercase tracking-[0.14em] text-[10px]"
            style={{ color: 'var(--color-ink-3)' }}
          >
            Algemeen oordeel
          </span>
          <span
            className="font-mono uppercase tracking-[0.14em] text-[10px] font-bold"
            style={{ color: CATEGORY_COLORS[summary.level] }}
          >
            {CATEGORY_LABELS[summary.level]}
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            color: 'var(--color-ink)',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {summary.message}
        </p>
      </div>

      {/* Benchmark cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-6" style={{ gap: 'var(--gap-grid)' }}>
        {benchmarks.map((b) => (
          <BenchmarkCard key={b.key} benchmark={b} />
        ))}
      </div>

      {/* Hoe te lezen */}
      <div style={pageCardStyle} className="flex flex-col gap-3">
        <h3 style={cardTitleStyle}>Hoe lees je dit?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
          {(['excellent', 'good', 'average', 'concern', 'poor'] as const).map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{ fontSize: 10, color: 'var(--color-ink-3)' }}
              >
                {CATEGORY_LABELS[cat]}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed mt-2" style={{ color: 'var(--color-ink-3)' }}>
          De pin onder elke balk is jouw waarde, de gouden vlag boven is het ideaal voor jouw demografie.
          De gekleurde segmenten komen uit erkende richtlijnen (WHO, ACSM, ACE, peer-reviewed onderzoek).
          Normen zijn aangepast aan jouw leeftijdsgroep.
        </p>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-ink-3)' }}>
          <strong style={{ color: 'var(--color-ink-2)' }}>BMI is bewust laag gezet</strong> in deze
          weergave omdat het voor jou (gespierd, lage vet%) een misleidende metriek is.
          De FFMI-score hierboven geeft een veel beter beeld.
        </p>
      </div>
    </div>
  );
}
