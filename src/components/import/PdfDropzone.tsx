import { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface Props {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export function PdfDropzone({ onFileSelected, isLoading }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
        isDragging
          ? 'border-aurora-gold bg-aurora-gold/5'
          : 'border-aurora-border hover:border-aurora-gold/50'
      }`}
    >
      <label className="cursor-pointer flex flex-col items-center gap-4">
        {isLoading ? (
          <>
            <div className="w-12 h-12 border-2 border-aurora-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-ink-3">PDF wordt gelezen...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-aurora-surface flex items-center justify-center">
              {isDragging ? <FileText size={28} className="text-aurora-gold" /> : <Upload size={28} className="text-ink-3" />}
            </div>
            <div>
              <p className="text-ink font-medium">Sleep je PDF hier naartoe</p>
              <p className="text-ink-3 text-sm mt-1">of klik om een bestand te kiezen</p>
            </div>
          </>
        )}
        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
      </label>
    </div>
  );
}
