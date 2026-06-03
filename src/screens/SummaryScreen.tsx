import type { Workout, PRResult } from '../types';

interface SummaryScreenProps {
  workout: Workout;
  newPRs: PRResult[];
  onDone: () => void;
}

export default function SummaryScreen({ workout, newPRs, onDone }: SummaryScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="p-6 pt-10">
        <h1 className="text-2xl font-bold mb-6">Workout Complete 🎉</h1>

        {newPRs.length > 0 && (
          <div className="bg-yellow-950/50 border border-yellow-700/50 rounded-2xl p-5 mb-5">
            <h2 className="text-lg font-bold text-yellow-400 mb-3">🏆 New PRs!</h2>
            <div className="space-y-2">
              {newPRs.map((pr, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-yellow-200">{pr.exercise}</span>
                  <span className="text-sm font-bold text-yellow-300">{pr.weight} lbs × {pr.reps}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-400">{workout.totalVolume.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 mt-1">total lbs</div>
          </div>
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            {Object.entries(workout.volumeByMuscleGroup).map(([g, v]) => (
              <div key={g} className="flex justify-between text-sm">
                <span className="text-zinc-400">{g.replace(/_/g, ' ')}</span>
                <span className="text-zinc-300">{v.toLocaleString()} lbs</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">Exercises</h3>
          <div className="space-y-3">
            {workout.exercises.map((ex, i) => (
              <div key={i} className="border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                <div className="font-medium text-sm mb-1">{ex.name}</div>
                <div className="flex flex-wrap gap-1.5">
                  {ex.sets.map((set, j) => (
                    <span key={j} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-lg">
                      {set.weight}×{set.reps}
                      {set.rpe && <span className="text-yellow-500"> @{set.rpe}</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
