import { ChevronRight, LayoutList } from 'lucide-react';
import type { Template } from '../types';

interface OpeningScreenProps {
  workoutDate: string;
  templates: Template[];
  onDateChange: (date: string) => void;
  onFreeform: () => void;
  onFromTemplate: () => void;
}

export default function OpeningScreen({
  workoutDate,
  templates,
  onDateChange,
  onFreeform,
  onFromTemplate,
}: OpeningScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">New Workout</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <label className="block text-xs text-zinc-500 uppercase tracking-wide mb-2">Date</label>
        <input
          type="date"
          value={workoutDate}
          onChange={e => onDateChange(e.target.value)}
          className="w-full bg-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-3">
        {templates.length > 0 && (
          <button
            onClick={onFromTemplate}
            className="w-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold py-4 rounded-xl flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-3">
              <LayoutList size={20} className="text-indigo-400" />
              <span>From Template</span>
            </div>
            <ChevronRight size={18} className="text-zinc-500" />
          </button>
        )}

        <button
          onClick={onFreeform}
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-between px-5"
        >
          <span>Build Workout</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
