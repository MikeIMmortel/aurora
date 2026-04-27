interface Props {
  /** Hoofdwoord van de titel — bv. "Voeding" */
  title: string;
  /** Optioneel italic-deel dat aan titel hangt */
  emphasized?: string;
  /** Mono meta-regel onder de titel */
  meta?: string;
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '38px',
  color: 'var(--color-ink)',
  letterSpacing: '-0.01em',
  margin: 0,
  lineHeight: 1,
};

const TITLE_EM: React.CSSProperties = {
  fontStyle: 'italic',
  color: 'var(--color-aurora-gold)',
};

const META_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-ink-3)',
  marginTop: 10,
};

export function PageHeader({ title, emphasized, meta }: Props) {
  return (
    <div
      className="mb-7 pb-5"
      style={{ borderBottom: '1px solid var(--color-rule)' }}
    >
      <h2 style={TITLE_STYLE}>
        {title}
        {emphasized && <span style={TITLE_EM}>{emphasized}</span>}
      </h2>
      {meta && <p style={META_STYLE}>{meta}</p>}
    </div>
  );
}

/** Container voor pages — zelfde max-width en padding als Dashboard */
export const pageContainerStyle: React.CSSProperties = {
  maxWidth: '1480px',
  margin: '0 auto',
  padding: '0 32px 80px',
};

/** Standaard card-styling voor alle pages */
export const pageCardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-rule)',
  borderRadius: '14px',
  padding: 'var(--pad-card)',
};

/** Editorial card title (italic display) */
export const cardTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: '22px',
  color: 'var(--color-ink)',
  margin: 0,
  lineHeight: 1,
};

/** Mono meta label (uppercase tracking) */
export const cardMetaStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10.5px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-ink-3)',
};
