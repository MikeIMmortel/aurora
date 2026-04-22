import { Download } from 'lucide-react';
import { exportData } from '../../lib/storage';

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

export function Header() {
  return (
    <header className="h-16 border-b border-aurora-border bg-aurora-black flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl text-aurora-gold tracking-wide">AURORA</h1>
        <span className="text-sm text-gray-400 hidden sm:block">personal training</span>
      </div>
      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-aurora-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-aurora-surface"
        title="Download backup van alle metingen, doelen, voeding-instellingen en logs"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Backup</span>
      </button>
    </header>
  );
}
