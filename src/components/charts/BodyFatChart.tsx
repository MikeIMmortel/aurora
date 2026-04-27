import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { Measurement } from '../../types/measurement';
import { formatShortDate } from '../../lib/utils';
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

interface BodyFatChartProps {
  measurements: Measurement[];
  goalTarget?: number;
}

export default function BodyFatChart({ measurements, goalTarget }: BodyFatChartProps) {
  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    bodyFatPercentage: m.bodyFatPercentage,
  }));

  const latest = data.length ? data[data.length - 1].bodyFatPercentage : null;

  return (
    <div style={chartCardStyle}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={chartTitleStyle}>Vetpercentage</h3>
        {latest !== null && (
          <span style={chartMetaStyle}>{latest.toFixed(1)}% nu</span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-aurora-gold)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-aurora-gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="date" tick={chartTickStyle} axisLine={chartAxisStyle} tickLine={false} />
          <YAxis
            tick={chartTickStyle}
            axisLine={chartAxisStyle}
            tickLine={false}
            unit="%"
            domain={['dataMin - 1', 'dataMax + 1']}
            width={40}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
            formatter={((value: number | string) => [`${Number(value).toFixed(1)}%`, 'Vet']) as unknown as undefined}
          />
          {goalTarget !== undefined && (
            <ReferenceLine
              y={goalTarget}
              stroke={chartColors.accentDark}
              strokeDasharray="4 4"
              label={{
                value: `Doel ${goalTarget}%`,
                fill: 'var(--color-aurora-gold-dark)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                position: 'insideTopRight',
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="bodyFatPercentage"
            stroke={chartColors.accent}
            strokeWidth={1.75}
            fill="url(#bodyFatGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
