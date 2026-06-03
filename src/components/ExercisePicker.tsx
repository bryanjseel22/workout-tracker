import { X } from 'lucide-react';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '../data/exercises';
import type { ExerciseDefinition } from '../types';

interface ExercisePickerProps {
  selectedMuscleGroup: string | null;
  onSelect: (exercise: ExerciseDefinition, muscleGroup: string) => void;
  onSelectMuscleGroup: (group: string) => void;
  onClose: () => void;
}

export default function ExercisePicker({
  selectedMuscleGroup,
  onSelect,
  onSelectMuscleGroup,
  onClose,
}: ExercisePickerProps) {
  if (selectedMuscleGroup) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-end z-50">
        <div className="bg-zinc-900 w-full rounded-t-2xl max-h-[70vh] flex flex-col border-t border-zinc-700">
          <div className="flex justify-between items-center p-5 border-b border-zinc-800">
            <button
              onClick={() => onSelectMuscleGroup('')}
              className="text-zinc-400 hover:text-white text-sm"
            >
              ← Back
            </button>
            <h3 className="font-bold">{selectedMuscleGroup.replace(/_/g, ' ')}</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto p-4 space-y-2">
            {EXERCISE_LIBRARY[selectedMuscleGroup].map(ex => (
              <button
                key={ex.name}
                onClick={() => onSelect(ex, selectedMuscleGroup)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 p-4 rounded-xl text-left flex justify-between items-center"
              >
                <span className="font-medium">{ex.name}</span>
                <span className="text-xs text-zinc-500 capitalize">{ex.equipment}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end z-50">
      <div className="bg-zinc-900 w-full rounded-t-2xl max-h-[75vh] flex flex-col border-t border-zinc-700">
        <div className="flex justify-between items-center p-5 border-b border-zinc-800">
          <h3 className="font-bold text-lg">Select Muscle Group</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 grid grid-cols-3 gap-2">
          {MUSCLE_GROUPS.map(group => (
            <button
              key={group}
              onClick={() => onSelectMuscleGroup(group)}
              className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 p-3 rounded-xl text-sm text-center font-medium"
            >
              {group.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
