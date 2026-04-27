import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate, calculateBMI } from '../../lib/utils';
import {
  chartColors,
  chartCardStyle,
  chartTitleStyle,
  chartMetaStyle,
  chartTickStyle,
  chartAxisStyle,
  chartTooltipStyle,
  chartTooltipLabelStyle,
} from './chartTheme';

interface BMIChartProps {
  measurements: Measurement[];
}

export default function BMIChart({ measurements }: BMIChartProps) {
  if (measurements.length === 0) return null;

  const current = measurements[measurements.length - 1];
  const heightM = current.height / 100;
  const currentBMI = calculateBMI(current.weight, current.height);

  const healthyMin = 18.5 * heightM * heightM;
  const healthyMax = 24.9 * heightM * heightM;
  const targetWeight = 25.0 * heightM * heightM;

  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    bmi: Math.round(calculateBMI(m.weight, m.height) * 10) / 10,
  }));

  const allBMIs = data.map((d) => d.bmi);
  const minBMI = Math.min(...allBMIs, 18.5);
  const maxBMI = Math.max(...allBMIs, 25);
  const yMin = Math.floor(minBMI - 1);
  const yMax = Math.ceil(maxBMI + 1);

  return (
    <div style={chartCardStyle}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 style={chartTitleStyle}>BMI verloop</h3>
          <p style={{ ...chartMetaStyle, marginTop: 4 }}>
            Lengte {current.height} cm · Leeftijd {current.age} jaar
          </p>
        </div>
        <div className="text-right">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              color: 'var(--color-ink)',
              lineHeight: 1,
              margin: 0,
            }}
            className="tabular-nums"
          >
            {currentBMI.toFixed(1)}
          </p>
          <p style={{ ...chartMetaStyle, marginTop: 4 }}>huidig</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />

          <ReferenceArea
            y1={18.5}
            y2={24.9}
            fill={chartColors.positive}
            fillOpacity={0.06}
            strokeOpacity={0}
          />

          <ReferenceLine
            y={18.5}
            stroke={chartColors.positive}
            strokeDasharray="3 3"
            strokeOpacity={0.4}
            label={{ value: '18.5', position: 'left', fill: 'var(--color-positive)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
          />
          <ReferenceLine
            y={24.9}
            stroke={chartColors.positive}
            strokeDasharray="3 3"
            strokeOpacity={0.4}
            label={{ value: '24.9', position: 'left', fill: 'var(--color-positive)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
          />
          <ReferenceLine
            y={30}
            stroke={chartColors.negative}
            strokeDasharray="3 3"
            strokeOpacity={0.3}
            label={{ value: '30 Obesitas', position: 'right', fill: 'var(--color-negative)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
          />

          <XAxis dataKey="date" tick={chartTickStyle} axisLine={chartAxisStyle} tickLine={false} />
          <YAxis tick={chartTickStyle} axisLine={chartAxisStyle} tickLine={false} domain={[yMin, yMax]} width={36} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
            formatter={((value: number | string) => [`${Number(value).toFixed(1)}`]) as unknown as undefined}
            labelFormatter={(label) => String(label ?? '')}
          />
          <Line
            type="monotone"
            dataKey="bmi"
            stroke={chartColors.ink}
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 4, fill: chartColors.ink, stroke: chartColors.bgCard, strokeWidth: 2 }}
            name="BMI"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <InfoTile label="Gezond gewicht" value={`${healthyMin.toFixed(0)} – ${healthyMax.toFixed(0)} kg`} variant="positive" />
        <InfoTile label="Streefgewicht" value={`≤ ${targetWeight.toFixed(1)} kg`} variant="accent" />
        <InfoTile
          label={current.weight > targetWeight ? 'Nog af te vallen' : 'Status'}
          value={
            current.weight > targetWeight
              ? `−${(current.weight - targetWeight).toFixed(1)} kg`
              : '✓ Op streef'
          }
          variant={current.weight > targetWeight ? 'negative' : 'positive'}
        />
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: 'positive' | 'negative' | 'accent';
}) {
  const color =
    variant === 'positive'
      ? 'var(--color-positive)'
      : variant === 'negative'
        ? 'var(--color-negative)'
        : 'var(--color-aurora-gold)';
  return (
    <div
      className="rounded-[10px] p-3 text-center"
      style={{ background: 'var(--color-bg-sunken)' }}
    >
      <p style={{ ...chartMetaStyle, fontSize: 9, marginBottom: 4 }}>{label}</p>
      <p
        className="tabular-nums"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          color,
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}
