/**
 * Gemeenschappelijke chart-styling die met de design tokens meebeweegt.
 * SVG attributes accepteren `var()` referenties direct, dus we kunnen
 * dezelfde tokens gebruiken die in CSS staan.
 */

export const chartColors = {
  grid: 'var(--color-rule)',
  axis: 'var(--color-ink-4)',
  axisTick: 'var(--color-ink-3)',
  ink: 'var(--color-ink)',
  ink2: 'var(--color-ink-2)',
  ink3: 'var(--color-ink-3)',
  accent: 'var(--color-aurora-gold)',
  accentDark: 'var(--color-aurora-gold-dark)',
  accentSoft: 'var(--color-aurora-gold-light)',
  positive: 'var(--color-positive)',
  negative: 'var(--color-negative)',
  bgCard: 'var(--color-bg-card)',
  bgSunken: 'var(--color-bg-sunken)',
} as const;

export const chartTickStyle = {
  fill: 'var(--color-ink-3)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
} as const;

export const chartAxisStyle = {
  stroke: 'var(--color-ink-4)',
} as const;

export const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-rule-2)',
  borderRadius: '8px',
  color: 'var(--color-ink)',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  padding: '8px 12px',
};

export const chartTooltipLabelStyle: React.CSSProperties = {
  color: 'var(--color-ink-3)',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 10,
};

export const chartCardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-rule)',
  borderRadius: '14px',
  padding: 'var(--pad-card)',
};

export const chartTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: '22px',
  color: 'var(--color-ink)',
  margin: 0,
  lineHeight: 1,
};

export const chartMetaStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10.5px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-ink-3)',
};
