import { useState } from 'react';
import type { Measurement } from '../types/measurement';
import { parsePdf } from '../lib/pdf-parser';
import { PdfDropzone } from '../components/import/PdfDropzone';
import { ParsePreview } from '../components/import/ParsePreview';
import { ImportHistory } from '../components/import/ImportHistory';
import { PageHeader, pageContainerStyle } from '../components/layout/PageHeader';

interface Props {
  measurements: Measurement[];
  addMeasurements: (m: Measurement[]) => void;
  deleteMeasurement: (id: string) => void;
}

export function ImportPage({ measurements, addMeasurements, deleteMeasurement }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [parsed, setParsed] = useState<Measurement[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existingDates = measurements.map((m) => m.date);

  async function handleFile(file: File) {
    setIsLoading(true);
    setError(null);
    setParsed(null);
    try {
      const result = await parsePdf(file);
      if (result.length === 0) {
        setError('Geen metingen gevonden in deze PDF. Controleer of het een Aurora meting-PDF is.');
      } else {
        setParsed(result);
      }
    } catch (err) {
      setError(`Fout bij het lezen van de PDF: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirm() {
    if (!parsed) return;
    const newOnes = parsed.filter((m) => !existingDates.includes(m.date));
    addMeasurements(newOnes);
    setParsed(null);
  }

  return (
    <div style={pageContainerStyle}>
      <PageHeader
        title="Im"
        emphasized="port"
        meta={`${measurements.length} ${measurements.length === 1 ? 'meting' : 'metingen'} in archief`}
      />

      <div className="max-w-4xl flex flex-col" style={{ gap: 'var(--gap-grid)' }}>
        <PdfDropzone onFileSelected={handleFile} isLoading={isLoading} />

        {error && (
          <div
            className="rounded-[14px] p-4 text-sm"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-negative)',
              color: 'var(--color-negative)',
            }}
          >
            {error}
          </div>
        )}

        {parsed && (
          <ParsePreview
            parsed={parsed}
            duplicates={existingDates}
            onConfirm={handleConfirm}
            onCancel={() => setParsed(null)}
          />
        )}

        {measurements.length > 0 && (
          <ImportHistory measurements={measurements} onDelete={deleteMeasurement} />
        )}
      </div>
    </div>
  );
}
