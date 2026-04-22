import type { Measurement } from '../../types/measurement';
import { calculateBMI, getBMICategory } from '../../lib/utils';

interface MeasurementLabelsProps {
  measurement: Measurement;
  label: string;
}

interface RowProps {
  name: string;
  value: string;
  unit: string;
  highlight?: boolean;
}

function Row({ name, value, unit, highlight }: RowProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-gray-400 text-sm">{name}</span>
      <span className={`font-medium text-sm tabular-nums ${highlight ? 'text-aurora-gold' : 'text-white'}`}>
        {value}
        <span className="text-gray-500 ml-1 text-xs">{unit}</span>
      </span>
    </div>
  );
}

export default function MeasurementLabels({ measurement: m, label }: MeasurementLabelsProps) {
  const bmi = calculateBMI(m.weight, m.height);
  const bmiCat = getBMICategory(bmi);

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
        {label}
      </h4>

      <div className="space-y-0.5">
        <Row name="Gewicht" value={m.weight.toFixed(1)} unit="kg" highlight />
        <Row name="BMI" value={bmi.toFixed(1)} unit={bmiCat.label} highlight />
        <Row name="Vetmassa" value={m.fatMass.toFixed(1)} unit="kg" />
        <Row name="Spiermassa" value={m.leanMass.toFixed(1)} unit="kg" />

        <div className="border-t border-[#2A2A2A] my-2" />

        <Row name="Buikomvang" value={m.circumferences.belly.toFixed(1)} unit="cm" />
        <Row name="Armomvang" value={m.circumferences.arm.toFixed(1)} unit="cm" />
        <Row name="Bovenbeen" value={m.circumferences.upperLeg.toFixed(1)} unit="cm" />
      </div>
    </div>
  );
}
