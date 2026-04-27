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
      <nav className="hidden md:flex w-56 border-r border-aurora-border bg-aurora-black flex-col py-4 shrink-0">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'text-aurora-gold bg-aurora-surface border-r-2 border-aurora-gold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-aurora-surface-hover'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-aurora-border bg-aurora-black flex z-50">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive ? 'text-aurora-gold' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
