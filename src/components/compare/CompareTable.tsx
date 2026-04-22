import type { Measurement } from '../../types/measurement';
import { formatDate } from '../../lib/utils';

interface Props {
  left: Measurement;
  right: Measurement;
}

interface Row {
  label: string;
  unit: string;
  leftVal: number;
  rightVal: number;
  decreaseIsGood: boolean;
}

function getRows(left: Measurement, right: Measurement): Row[] {
  return [
    { label: 'Gewicht', unit: 'kg', leftVal: left.weight, rightVal: right.weight, decreaseIsGood: true },
    { label: 'Vetpercentage', unit: '%', leftVal: left.bodyFatPercentage, rightVal: right.bodyFatPercentage, decreaseIsGood: true },
    { label: 'Vetmassa', unit: 'kg', leftVal: left.fatMass, rightVal: right.fatMass, decreaseIsGood: true },
    { label: 'Vetvrije massa', unit: 'kg', leftVal: left.leanMass, rightVal: right.leanMass, decreaseIsGood: false },
    { label: 'Buikomvang', unit: 'cm', leftVal: left.circumferences.belly, rightVal: right.circumferences.belly, decreaseIsGood: true },
    { label: 'Armomvang', unit: 'cm', leftVal: left.circumferences.arm, rightVal: right.circumferences.arm, decreaseIsGood: false },
    { label: 'Bovenbeen', unit: 'cm', leftVal: left.circumferences.upperLeg, rightVal: right.circumferences.upperLeg, decreaseIsGood: false },
    { label: 'Triceps', unit: 'mm', leftVal: left.skinfolds.triceps, rightVal: right.skinfolds.triceps, decreaseIsGood: true },
    { label: 'Subscapular', unit: 'mm', leftVal: left.skinfolds.subscapular, rightVal: right.skinfolds.subscapular, decreaseIsGood: true },
    { label: 'Suprailiac', unit: 'mm', leftVal: left.skinfolds.suprailiac, rightVal: right.skinfolds.suprailiac, decreaseIsGood: true },
    { label: 'Axilla', unit: 'mm', leftVal: left.skinfolds.axilla, rightVal: right.skinfolds.axilla, decreaseIsGood: true },
    { label: 'Buik', unit: 'mm', leftVal: left.skinfolds.belly, rightVal: right.skinfolds.belly, decreaseIsGood: true },
    { label: 'Borst', unit: 'mm', leftVal: left.skinfolds.chest, rightVal: right.skinfolds.chest, decreaseIsGood: true },
    { label: 'Dijbeen', unit: 'mm', leftVal: left.skinfolds.thigh, rightVal: right.skinfolds.thigh, decreaseIsGood: true },
  ];
}

export function CompareTable({ left, right }: Props) {
  const rows = getRows(left, right);

  return (
    <div className="bg-aurora-surface border border-aurora-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-aurora-border text-gray-400">
            <th className="text-left px-6 py-3 font-medium"></th>
            <th className="text-right px-4 py-3 font-medium">{formatDate(left.date)}</th>
            <th className="text-right px-4 py-3 font-medium">{formatDate(right.date)}</th>
            <th className="text-right px-6 py-3 font-medium">Delta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const delta = row.rightVal - row.leftVal;
            const isImproved = row.decreaseIsGood ? delta < 0 : delta > 0;
            const isNeutral = Math.abs(delta) < 0.05;
            const colorClass = isNeutral ? 'text-gray-400' : isImproved ? 'text-positive' : 'text-negative';
            const sign = delta > 0 ? '+' : '';

            return (
              <tr key={row.label} className="border-b border-aurora-border/50 hover:bg-aurora-surface-hover transition-colors">
                <td className="px-6 py-2.5 font-medium text-gray-300">{row.label}</td>
                <td className="text-right px-4 py-2.5">{row.leftVal} {row.unit}</td>
                <td className="text-right px-4 py-2.5">{row.rightVal} {row.unit}</td>
                <td className={`text-right px-6 py-2.5 font-medium ${colorClass}`}>
                  {isNeutral ? '—' : `${sign}${delta.toFixed(1)} ${row.unit}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
