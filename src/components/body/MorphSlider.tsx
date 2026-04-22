import { formatDate } from '../../lib/utils';

interface MorphSliderProps {
  value: number;
  onChange: (v: number) => void;
  dateA: string;
  dateB: string;
}

export default function MorphSlider({ value, onChange, dateA, dateB }: MorphSliderProps) {
  return (
    <div className="w-full px-2">
      <input
        type="range"
        min={0}
        max={1}
        step={0.005}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="morph-slider w-full"
      />
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{formatDate(dateA)}</span>
        <span>{formatDate(dateB)}</span>
      </div>

      {/* Custom slider styling */}
      <style>{`
        .morph-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            #2A2A2A ${value * 100}%,
            #2A2A2A 100%
          );
          background-size: 100% 100%;
          outline: none;
          cursor: pointer;
          position: relative;
        }
        .morph-slider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: ${value * 100}%;
          background: linear-gradient(90deg, #A07D3A, #C8A55C);
          border-radius: 3px;
          pointer-events: none;
        }
        .morph-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #C8A55C;
          border: 2px solid #0A0A0A;
          box-shadow: 0 0 8px rgba(200, 165, 92, 0.4);
          cursor: grab;
          position: relative;
          z-index: 2;
        }
        .morph-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
          box-shadow: 0 0 12px rgba(200, 165, 92, 0.6);
        }
        .morph-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #C8A55C;
          border: 2px solid #0A0A0A;
          box-shadow: 0 0 8px rgba(200, 165, 92, 0.4);
          cursor: grab;
        }
        .morph-slider::-moz-range-track {
          background: #2A2A2A;
          height: 6px;
          border-radius: 3px;
        }
        .morph-slider::-moz-range-progress {
          background: linear-gradient(90deg, #A07D3A, #C8A55C);
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
