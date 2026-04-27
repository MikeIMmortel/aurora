import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--color-bg)', color: 'var(--color-ink)' }}
    >
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
