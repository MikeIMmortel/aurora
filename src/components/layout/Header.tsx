import { Download } from 'lucide-react';
import { exportData } from '../../lib/storage';
import { ThemeToggle } from './ThemeToggle';

function handleExport() {
  try {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `aurora-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed', err);
    alert('Export mislukt. Check de console.');
  }
}

function todayLong(): string {
  const d = new Date();
  const wd = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const m = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  return `${wd[d.getDay()]}, ${d.getDate()} ${m[d.getMonth()]}`;
}

function todayDots(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd} · ${mm} · ${d.getFullYear()}`;
}

export function Header() {
  return (
    <header
      className="grid items-end gap-6 pb-5 mb-7 shrink-0"
      style={{
        gridTemplateColumns: '1fr auto 1fr',
        borderBottom: '1px solid var(--color-rule-2)',
        padding: '0 32px',
        paddingTop: '24px',
      }}
    >
      {/* Links — Aurora · 001 + Lichaamsjournaal */}
      <div className="flex flex-col gap-1.5">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--color-ink-3)' }}
        >
          Aurora · 001
        </span>
        <h1
          className="font-display text-[38px] leading-none m-0"
          style={{ color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
        >
          Lichaams<em style={{ fontStyle: 'italic', color: 'var(--color-aurora-gold)' }}>journaal</em>
        </h1>
      </div>

      {/* Center — datum (alleen desktop) */}
      <div className="hidden md:flex flex-col gap-1 text-center">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--color-ink-3)' }}
        >
          {todayDots()}
        </span>
        <span
          className="font-display italic text-[16px]"
          style={{ color: 'var(--color-ink-2)' }}
        >
          {todayLong()}
        </span>
      </div>

      {/* Rechts — backup + theme */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.08em] px-3 py-1.5 rounded-full transition-colors"
          style={{
            border: '1px solid var(--color-rule-2)',
            color: 'var(--color-ink-3)',
            background: 'var(--color-bg-card)',
          }}
          title="Download backup van alle data"
        >
          <Download size={12} />
          <span className="hidden sm:inline">Backup</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
