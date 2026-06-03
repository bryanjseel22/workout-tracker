import { useState } from 'react';
import { ArrowLeft, X, Dumbbell } from 'lucide-react';
import ExercisePicker from '../components/ExercisePicker';
import type { WorkoutExercise, ExerciseDefinition } from '../types';

interface BuilderScreenProps {
  exercises: WorkoutExercise[];
  onAdd: (exercise: WorkoutExercise) => void;
  onRemove: (id: number) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function BuilderScreen({ exercises, onAdd, onRemove, onStart, onBack }: BuilderScreenProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleSelect = (ex: ExerciseDefinition, group: string) => {
    onAdd({
      id: Date.now(),
      name: ex.name,
      muscleGroup: group,
      equipment: ex.equipment,
      startWeight: ex.startWeight,
    });
    setPickerOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32">
      <div className="p-6 pt-10">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-zinc-400 hover:text-white" aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold">Build Workout</h1>
        </div>

        {exercises.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Your Plan</h2>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{i + 1}. {ex.name}</div>
                    <div className="text-xs text-zinc-500">{ex.muscleGroup.replace(/_/g, ' ')}</div>
                  </div>
                  <button onClick={() => onRemove(ex.id)} className="text-zinc-600 hover:text-red-400 p-1">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setPickerOpen(true)}
          className="w-full border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 py-4 rounded-xl text-sm font-medium"
        >
          + Add Exercise
        </button>
      </div>

      {exercises.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
          <button
            onClick={onStart}
            className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Dumbbell size={20} />
            Start Workout ({exercises.length})
          </button>
        </div>
      )}

      {pickerOpen && (
        <ExercisePicker
          selectedMuscleGroup={selectedGroup}
          onSelect={handleSelect}
          onSelectMuscleGroup={setSelectedGroup}
          onClose={() => { setPickerOpen(false); setSelectedGroup(null); }}
        />
      )}
    </div>
  );
}
