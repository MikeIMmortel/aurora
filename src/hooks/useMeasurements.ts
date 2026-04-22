import { useState, useCallback, useMemo } from 'react';
import type { Measurement } from '../types/measurement';
import { loadMeasurements, saveMeasurements } from '../lib/storage';
import { correctMeasurement } from '../lib/utils';

export function useMeasurements() {
  const [rawMeasurements, setRawMeasurements] = useState<Measurement[]>(loadMeasurements);

  // Kledingcorrectie: −2,3 kg op alle metingen
  const measurements = useMemo(
    () => rawMeasurements.map(correctMeasurement),
    [rawMeasurements],
  );

  const persist = useCallback((updated: Measurement[]) => {
    const sorted = [...updated].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setRawMeasurements(sorted);
    saveMeasurements(sorted);
  }, []);

  const addMeasurement = useCallback((m: Measurement) => {
    setRawMeasurements((prev) => {
      if (prev.some((existing) => existing.date === m.date)) {
        throw new Error(`Meting voor ${m.date} bestaat al`);
      }
      const updated = [...prev, m];
      const sorted = updated.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      saveMeasurements(sorted);
      return sorted;
    });
  }, []);

  const addMeasurements = useCallback((newMeasurements: Measurement[]) => {
    setRawMeasurements((prev) => {
      const existingDates = new Set(prev.map((m) => m.date));
      const unique = newMeasurements.filter((m) => !existingDates.has(m.date));
      if (unique.length === 0) return prev;
      const updated = [...prev, ...unique].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      saveMeasurements(updated);
      return updated;
    });
  }, []);

  const deleteMeasurement = useCallback((id: string) => {
    setRawMeasurements((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMeasurements(updated);
      return updated;
    });
  }, []);

  const getLatest = useCallback(
    () => measurements[measurements.length - 1] || null,
    [measurements]
  );

  const getPrevious = useCallback(
    () => measurements[measurements.length - 2] || null,
    [measurements]
  );

  const getFirst = useCallback(
    () => measurements[0] || null,
    [measurements]
  );

  return {
    measurements,
    addMeasurement,
    addMeasurements,
    deleteMeasurement,
    getLatest,
    getPrevious,
    getFirst,
    persist,
  };
}
