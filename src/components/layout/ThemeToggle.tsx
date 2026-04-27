import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'aurora-theme';

function getInitial(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // Default to light per design (was dark in old palette)
  return 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Thema wisselen"
      className="w-8 h-8 rounded-full border border-aurora-border bg-aurora-surface text-aurora-ink-2 hover:text-aurora-ink hover:border-aurora-ink-3 inline-flex items-center justify-center transition-colors"
      style={{ color: 'var(--color-ink-2)' }}
    >
      {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
}
