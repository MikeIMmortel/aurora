import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
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

interface CircumferenceChartProps {
  measurements: Measurement[];
}

export default function CircumferenceChart({ measurements }: CircumferenceChartProps) {
  if (measurements.length === 0) return null;

  const first = measurements[0].circumferences;

  const data = measurements.map((m) => ({
    date: formatShortDate(m.date),
    belly: first.belly !== 0 ? ((m.circumferences.belly - first.belly) / first.belly) * 100 : 0,
    arm: first.arm !== 0 ? ((m.circumferences.arm - first.arm) / first.arm) * 100 : 0,
    upperLeg: first.upperLeg !== 0 ? ((m.circumferences.upperLeg - first.upperLeg) / first.upperLeg) * 100 : 0,
  }));

  return (
    <div style={chartCardStyle}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={chartTitleStyle}>Omtrekken</h3>
        <span style={chartMetaStyle}>% verandering vs eerste meting</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="date" tick={chartTickStyle} axisLine={chartAxisStyle} tickLine={false} />
          <YAxis
            tick={chartTickStyle}
            axisLine={chartAxisStyle}
            tickLine={false}
            unit="%"
            domain={[-10, 10]}
            allowDecimals={false}
            width={40}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
            formatter={((value: number | string) => [`${Number(value).toFixed(1)}%`]) as unknown as undefined}
          />
          <Legend
            iconType="line"
            wrapperStyle={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-ink-3)',
            }}
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                belly: 'Buik',
                arm: 'Arm',
                upperLeg: 'Bovenbeen',
              };
              return <span style={{ color: 'var(--color-ink-2)' }}>{labels[value] ?? value}</span>;
            }}
          />
          <Line type="monotone" dataKey="belly" stroke={chartColors.negative} strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="arm" stroke={chartColors.accent} strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="upperLeg" stroke={chartColors.ink} strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
