import type { Measurement } from '../types/measurement';
import {
  buildBenchmarks,
  summarizeBenchmarks,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../lib/benchmarks';
import BenchmarkCard from '../components/benchmarks/BenchmarkCard';
import { formatDate } from '../lib/utils';

interface Props {
  measurements: Measurement[];
}

export function BenchmarkPage({ measurements }: Props) {
  const latest = measurements[measurements.length - 1];

  if (!latest) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-3">
          Geen metingen gevonden. Importeer eerst een PDF om benchmarks te zien.
        </p>
      </div>
    );
  }

  const benchmarks = buildBenchmarks(latest);
  const summary = summarizeBenchmarks(benchmarks);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold">Benchmark</h2>
        <p className="text-sm text-ink-3 mt-1">
          Hoe scoor jij vergeleken met mannen van{' '}
          <span className="text-aurora-gold">{latest.age} jaar</span> en{' '}
          <span className="text-aurora-gold">{latest.height} cm</span>?
          <span className="text-ink-3"> · meting {formatDate(latest.date)}</span>
        </p>
      </div>

      {/* Hero summary */}
      <div
        className="rounded-2xl border p-6 flex flex-col gap-3"
        style={{
          borderColor: CATEGORY_COLORS[summary.level] + '60',
          backgroundColor: CATEGORY_COLORS[summary.level] + '10',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[summary.level] }}
          />
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: CATEGORY_COLORS[summary.level] }}
          >
            Algemeen oordeel: {CATEGORY_LABELS[summary.level]}
          </span>
        </div>
        <p className="text-base text-ink leading-relaxed">{summary.message}</p>
      </div>

      {/* Benchmark cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {benchmarks.map((b) => (
          <BenchmarkCard key={b.key} benchmark={b} />
        ))}
      </div>

      {/* Hoe te lezen */}
      <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-ink">Hoe lees je dit?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['excellent', 'good', 'average', 'concern', 'poor'] as const).map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="text-xs text-ink-3">{CATEGORY_LABELS[cat]}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-3 leading-relaxed mt-2">
          Het witte bolletje op elke balk is jouw waarde. De gekleurde segmenten zijn
          de drempels uit erkende richtlijnen (WHO, ACSM, ACE, peer-reviewed onderzoek).
          Normen zijn aangepast aan jouw leeftijdsgroep — wat "fit" is voor 50 is anders
          dan voor 25.
        </p>
        <p className="text-xs text-ink-3 leading-relaxed">
          <strong className="text-ink-3">BMI is bewust laag gezet</strong> in deze
          weergave omdat het voor jou (gespierd, lage vet%) een misleidende metriek is.
          De FFMI-score hierboven geeft een veel beter beeld.
        </p>
      </div>
    </div>
  );
}
