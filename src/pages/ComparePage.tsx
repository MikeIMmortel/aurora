import { useState } from 'react';
import type { Measurement } from '../types/measurement';
import { CompareSelector } from '../components/compare/CompareSelector';
import { CompareTable } from '../components/compare/CompareTable';

interface Props {
  measurements: Measurement[];
}

export function ComparePage({ measurements }: Props) {
  const [leftDate, setLeftDate] = useState(measurements[0]?.date || '');
  const [rightDate, setRightDate] = useState(measurements[measurements.length - 1]?.date || '');

  if (measurements.length < 2) {
    return (
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-xl font-semibold">Metingen vergelijken</h2>
        <p className="text-ink-3">Je hebt minimaal 2 metingen nodig om te vergelijken.</p>
      </div>
    );
  }

  const left = measurements.find((m) => m.date === leftDate) || measurements[0];
  const right = measurements.find((m) => m.date === rightDate) || measurements[measurements.length - 1];

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-xl font-semibold">Metingen vergelijken</h2>
      <CompareSelector
        measurements={measurements}
        leftDate={left.date}
        rightDate={right.date}
        onLeftChange={setLeftDate}
        onRightChange={setRightDate}
      />
      <CompareTable left={left} right={right} />
    </div>
  );
}
