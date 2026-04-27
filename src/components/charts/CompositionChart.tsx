import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
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

interface CompositionChartProps {
  measurements: Measurement[];
}

export default function CompositionChart({ measurements }: CompositionChartProps) {
  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    leanMass: m.leanMass,
    fatMass: m.fatMass,
  }));

  return (
    <div style={chartCardStyle}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={chartTitleStyle}>Lichaamssamenstelling</h3>
        <span style={chartMetaStyle}>Spier · Vet</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubChart
          title="Spiermassa"
          data={data}
          dataKey="leanMass"
          color={chartColors.accent}
          gradientId="leanGrad"
        />
        <SubChart
          title="Vetmassa"
          data={data}
          dataKey="fatMass"
          color={chartColors.negative}
          gradientId="fatGrad"
        />
      </div>
    </div>
  );
}

interface SubChartProps {
  title: string;
  data: { date: string; leanMass: number; fatMass: number }[];
  dataKey: 'leanMass' | 'fatMass';
  color: string;
  gradientId: string;
}

function SubChart({ title, data, dataKey, color, gradientId }: SubChartProps) {
  return (
    <div>
      <p style={{ ...chartMetaStyle, marginBottom: 8 }}>{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="date" tick={chartTickStyle} axisLine={chartAxisStyle} tickLine={false} />
          <YAxis
            tick={chartTickStyle}
            axisLine={chartAxisStyle}
            tickLine={false}
            unit=" kg"
            domain={['dataMin - 1', 'dataMax + 1']}
            width={50}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
            formatter={((value: number | string) => [`${Number(value).toFixed(1)} kg`]) as unknown as undefined}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: chartColors.bgCard, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
