import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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

interface WeightChartProps {
  measurements: Measurement[];
}

export default function WeightChart({ measurements }: WeightChartProps) {
  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    weight: m.weight,
    leanMass: m.leanMass,
    fatMass: m.fatMass,
  }));

  return (
    <div style={chartCardStyle}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={chartTitleStyle}>Lichaamscompositie</h3>
        <span style={chartMetaStyle}>Gewicht · Spier · Vet</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="date"
            stroke={chartAxisStyle.stroke}
            tick={chartTickStyle}
            tickLine={false}
            axisLine={chartAxisStyle}
          />
          <YAxis
            stroke={chartAxisStyle.stroke}
            tick={chartTickStyle}
            tickLine={false}
            axisLine={chartAxisStyle}
            unit=" kg"
            width={60}
            domain={['dataMin - 3', 'dataMax + 3']}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
            formatter={((value: number | string) => [`${Number(value).toFixed(1)} kg`]) as unknown as undefined}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={chartColors.ink}
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 4, fill: chartColors.ink, stroke: chartColors.bgCard, strokeWidth: 2 }}
            name="Gewicht"
          />
          <Line
            type="monotone"
            dataKey="leanMass"
            stroke={chartColors.accent}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: chartColors.accent, stroke: chartColors.bgCard, strokeWidth: 2 }}
            name="Spier"
          />
          <Line
            type="monotone"
            dataKey="fatMass"
            stroke={chartColors.negative}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            activeDot={{ r: 4, fill: chartColors.negative, stroke: chartColors.bgCard, strokeWidth: 2 }}
            name="Vet"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
