import { X } from 'lucide-react';
import { useState } from 'react';
import type { Equipment } from '../types';

interface PlateCalculatorProps {
  equipment: Equipment;
  startWeight: number;
  onApply: (weight: number) => void;
  onClose: () => void;
}

const PLATE_SIZES = [
  { key: 'p45' as const, label: '45', weight: 45 },
  { key: 'p25' as const, label: '25', weight: 25 },
  { key: 'p10' as const, label: '10', weight: 10 },
  { key: 'p5' as const, label: '5', weight: 5 },
  { key: 'p2_5' as const, label: '2.5', weight: 2.5 },
];

type PlateKey = 'p45' | 'p25' | 'p10' | 'p5' | 'p2_5';
type Counts = Record<PlateKey, number>;

export default function PlateCalculator({ equipment, startWeight, onApply, onClose }: PlateCalculatorProps) {
  const [counts, setCounts] = useState<Counts>({ p45: 0, p25: 0, p10: 0, p5: 0, p2_5: 0 });
  const [dbWeight, setDbWeight] = useState(0);

  const totalWeight = (() => {
    if (equipment === 'dumbbell') return dbWeight * 2;
    const platesPerSide = PLATE_SIZES.reduce((sum, p) => sum + counts[p.key] * p.weight, 0);
    if (equipment === 'barbell' || equipment === 'sled') return startWeight + platesPerSide * 2;
    if (equipment === 'machine') return platesPerSide * 2;
    return 0;
  })();

  const adj = (key: PlateKey, delta: number) =>
    setCounts(c => ({ ...c, [key]: Math.max(0, c[key] + delta) }));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
      <div className="bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-700 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-zinc-800">
          <h3 className="font-bold text-lg">Plate Calculator</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="text-center mb-5">
            <div className="text-4xl font-bold text-white">{totalWeight}</div>
            <div className="text-zinc-500 text-sm mt-1">
              {equipment === 'barbell' && `incl. ${startWeight} lb bar`}
              {equipment === 'sled' && `incl. ${startWeight} lb sled`}
              {equipment === 'dumbbell' && 'total (both DBs)'}
              {equipment === 'machine' && 'total (both sides)'}
            </div>
          </div>

          {equipment === 'dumbbell' ? (
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Weight per dumbbell</label>
              <input
                type="number"
                inputMode="decimal"
                step="2.5"
                min="0"
                value={dbWeight || ''}
                onChange={e => setDbWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-800 rounded-xl p-3 text-white text-center text-2xl"
                placeholder="0"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 mb-1">
                {equipment === 'machine' ? 'Plates per side (no bar):' : 'Plates per side:'}
              </p>
              {PLATE_SIZES.map(({ key, label, weight: _ }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-zinc-300 text-sm w-20">{label} lb</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adj(key, -1)}
                      className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-lg font-bold"
                    >−</button>
                    <span className="w-6 text-center font-semibold">{counts[key]}</span>
                    <button
                      onClick={() => adj(key, 1)}
                      className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-lg font-bold"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={() => onApply(totalWeight)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-4 rounded-xl"
          >
            Use {totalWeight} lbs
          </button>
        </div>
      </div>
    </div>
  );
}
