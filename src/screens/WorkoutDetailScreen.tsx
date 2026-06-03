import { ArrowLeft, Trash2 } from 'lucide-react';
import type { Workout } from '../types';

interface WorkoutDetailScreenProps {
  workout: Workout;
  onBack: () => void;
  onDelete: (workout: Workout) => void;
}

export default function WorkoutDetailScreen({ workout, onBack, onDelete }: WorkoutDetailScreenProps) {
  const groups = [...new Set(workout.exercises.map(e => e.muscleGroup))];
  const title = groups.slice(0, 2).map(g => g.replace(/_/g, ' ')).join(' & ');

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="p-6 pt-10">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-zinc-400 hover:text-white" aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-zinc-500">
              {new Date(workout.date + 'T12:00:00').toLocaleDateString(undefined, {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 mb-4 border border-zinc-800">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold">{workout.totalVolume.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 mt-0.5">total lbs</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(workout.volumeByMuscleGroup).map(([g, v]) => (
              <div key={g} className="flex justify-between text-sm">
                <span className="text-zinc-400">{g.replace(/_/g, ' ')}</span>
                <span className="text-zinc-300">{v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="font-semibold mb-0.5">{ex.name}</div>
              <div className="text-xs text-zinc-500 mb-3">{ex.muscleGroup.replace(/_/g, ' ')}</div>
              <div className="flex flex-wrap gap-2">
                {ex.sets.map((set, j) => (
                  <span key={j} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-lg">
                    {set.weight} × {set.reps}
                    {set.rpe && <span className="text-yellow-500 ml-1">@{set.rpe}</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onDelete(workout)}
          className="w-full flex items-center justify-center gap-2 text-red-500 border border-red-900 py-3 rounded-xl hover:bg-red-950/30"
        >
          <Trash2 size={16} />
          Delete Workout
        </button>
      </div>
    </div>
  );
}
