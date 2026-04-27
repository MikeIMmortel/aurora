import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, GitCompareArrows, Target, PersonStanding, Utensils, Trophy } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/import', icon: Upload, label: 'Import' },
  { to: '/compare', icon: GitCompareArrows, label: 'Vergelijken' },
  { to: '/benchmark', icon: Trophy, label: 'Benchmark' },
  { to: '/goals', icon: Target, label: 'Doelen' },
  { to: '/nutrition', icon: Utensils, label: 'Voeding' },
  { to: '/body', icon: PersonStanding, label: 'Lichaam' },
] as const;

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex w-52 flex-col py-4 shrink-0"
        style={{
          background: 'var(--color-bg)',
          borderRight: '1px solid var(--color-rule)',
        }}
      >
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 px-8 py-2.5 text-sm transition-colors font-mono uppercase tracking-[0.06em] text-[11px]"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-aurora-gold)' : 'var(--color-ink-3)',
              borderLeft: isActive
                ? '2px solid var(--color-aurora-gold)'
                : '2px solid transparent',
              background: isActive ? 'var(--color-aurora-gold-light)' : 'transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={14} style={{ color: isActive ? 'var(--color-aurora-gold)' : 'var(--color-ink-3)' }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex z-50"
        style={{
          background: 'var(--color-bg-card)',
          borderTop: '1px solid var(--color-rule-2)',
        }}
      >
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors font-mono uppercase tracking-wider text-[9px]"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-aurora-gold)' : 'var(--color-ink-3)',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ color: isActive ? 'var(--color-aurora-gold)' : 'var(--color-ink-3)' }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
