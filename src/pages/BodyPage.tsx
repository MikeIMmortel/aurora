import { useState, useMemo } from 'react';
import type { Measurement } from '../types/measurement';
import { formatDate } from '../lib/utils';
import {
  interpolateMeasurement,
  measurementToBody,
  interpolateBody,
} from '../lib/body-interpolation';
import BodyScene from '../components/body/BodyScene';
import MorphSlider from '../components/body/MorphSlider';
import MeasurementLabels from '../components/body/MeasurementLabels';

interface BodyPageProps {
  measurements: Measurement[];
}

export function BodyPage({ measurements }: BodyPageProps) {
  const sorted = useMemo(
    () => [...measurements].sort((a, b) => a.date.localeCompare(b.date)),
    [measurements],
  );

  // Default: eerste en laatste meting
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(Math.max(0, sorted.length - 1));
  const [t, setT] = useState(0);

  if (sorted.length < 2) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <p className="text-ink-3 text-lg">
            Minimaal 2 metingen nodig voor de 3D vergelijking.
          </p>
          <p className="text-ink-3 text-sm">
            Importeer meer metingen via de Import-pagina.
          </p>
        </div>
      </div>
    );
  }

  const measA = sorted[idxA];
  const measB = sorted[idxB];

  // Geïnterpoleerde meting + body params
  const interpolated = interpolateMeasurement(measA, measB, t);
  const bodyA = measurementToBody(measA);
  const bodyB = measurementToBody(measB);
  const bodyParams = interpolateBody(bodyA, bodyB, t);

  return (
    <div className="space-y-4 lg:h-full lg:flex lg:flex-col">
      {/* Meting selectors */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-wider text-ink-3">
            Meting A
          </label>
          <select
            value={idxA}
            onChange={(e) => {
              setIdxA(Number(e.target.value));
              setT(0);
            }}
            className="bg-aurora-surface border border-aurora-border text-ink text-sm rounded-lg px-3 py-2 focus:border-aurora-gold focus:outline-none"
          >
            {sorted.map((m, i) => (
              <option key={m.id} value={i}>
                {formatDate(m.date)}
              </option>
            ))}
          </select>
        </div>

        <span className="text-aurora-gold font-semibold text-lg">vs</span>

        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-wider text-ink-3">
            Meting B
          </label>
          <select
            value={idxB}
            onChange={(e) => {
              setIdxB(Number(e.target.value));
              setT(0);
            }}
            className="bg-aurora-surface border border-aurora-border text-ink text-sm rounded-lg px-3 py-2 focus:border-aurora-gold focus:outline-none"
          >
            {sorted.map((m, i) => (
              <option key={m.id} value={i}>
                {formatDate(m.date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content: 3D canvas + labels */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* 3D Canvas */}
        <div className="flex-1 rounded-2xl border border-aurora-border bg-aurora-surface overflow-hidden min-h-[400px] lg:min-h-0">
          <BodyScene params={bodyParams} />
        </div>

        {/* Labels paneel */}
        <div className="lg:w-64 space-y-3 shrink-0">
          <MeasurementLabels measurement={interpolated} label="Huidige waarden" />

          {/* Delta paneel */}
          <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-4">
            <h4 className="text-xs uppercase tracking-wider text-ink-3 mb-3">
              Verschil A → B
            </h4>
            <div className="space-y-1.5">
              <DeltaRow
                name="Gewicht"
                delta={measB.weight - measA.weight}
                unit="kg"
                invert
              />
              <DeltaRow
                name="Vetpercentage"
                delta={measB.bodyFatPercentage - measA.bodyFatPercentage}
                unit="%"
                invert
              />
              <DeltaRow
                name="Spiermassa"
                delta={measB.leanMass - measA.leanMass}
                unit="kg"
              />
              <DeltaRow
                name="Buikomvang"
                delta={measB.circumferences.belly - measA.circumferences.belly}
                unit="cm"
                invert
              />
              <DeltaRow
                name="Armomvang"
                delta={measB.circumferences.arm - measA.circumferences.arm}
                unit="cm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Morph slider */}
      <div className="shrink-0 pb-4">
        <MorphSlider
          value={t}
          onChange={setT}
          dateA={measA.date}
          dateB={measB.date}
        />
      </div>
    </div>
  );
}

/** Delta rij met kleur */
function DeltaRow({
  name,
  delta,
  unit,
  invert = false,
}: {
  name: string;
  delta: number;
  unit: string;
  invert?: boolean;
}) {
  const isPositive = invert ? delta < 0 : delta > 0;
  const isNeutral = Math.abs(delta) < 0.05;
  const color = isNeutral
    ? 'text-ink-3'
    : isPositive
      ? 'text-positive'
      : 'text-negative';
  const sign = delta > 0 ? '+' : '';

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-ink-3 text-sm">{name}</span>
      <span className={`font-medium text-sm tabular-nums ${color}`}>
        {sign}
        {delta.toFixed(1)} {unit}
      </span>
    </div>
  );
}
