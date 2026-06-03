import { useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import type { Workout } from '../types';

interface HomeScreenProps {
  workoutHistory: Workout[];
  onViewWorkout: (workout: Workout) => void;
  onStartWorkout: () => void;
}

export default function HomeScreen({ workoutHistory, onViewWorkout, onStartWorkout }: HomeScreenProps) {
  const weeklyVolume = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const volumes: Record<string, number> = {};
    workoutHistory
      .filter(w => new Date(w.date) >= cutoff)
      .forEach(w => {
        Object.entries(w.volumeByMuscleGroup ?? {}).forEach(([g, v]) => {
          volumes[g] = (volumes[g] ?? 0) + v;
        });
      });
    return volumes;
  }, [workoutHistory]);

  const sorted = Object.entries(weeklyVolume).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="p-6 pt-10">
        <h1 className="text-2xl font-bold mb-6">This Week</h1>

        {sorted.length > 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-4 mb-6 border border-zinc-800">
            <div className="space-y-3">
              {sorted.map(([group, volume]) => {
                const pct = Math.round((volume / sorted[0][1]) * 100);
                return (
                  <div key={group}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-300">{group.replace(/_/g, ' ')}</span>
                      <span className="text-zinc-400">{volume.toLocaleString()} lbs</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full">
                      <div
                        className="h-1.5 bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-800 text-center">
            <p className="text-zinc-500 mb-4">No workouts this week</p>
            <button
              onClick={onStartWorkout}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 mx-auto"
            >
              <Dumbbell size={18} />
              Start First Workout
            </button>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4 text-zinc-300">History</h2>
        {workoutHistory.length > 0 ? (
          <div className="space-y-2">
            {workoutHistory.slice(0, 10).map((workout, idx) => {
              const groups = [...new Set(workout.exercises.map(e => e.muscleGroup))];
              const title = groups.slice(0, 2).map(g => g.replace(/_/g, ' ')).join(' & ');
              return (
                <button
                  key={idx}
                  onClick={() => onViewWorkout(workout)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-4 text-left flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {new Date(workout.date + 'T12:00:00').toLocaleDateString(undefined, {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                      {' · '}
                      {workout.exercises.length} exercises
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-zinc-300">
                      {workout.totalVolume.toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-600">lbs</div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">No workouts yet.</p>
        )}
      </div>
    </div>
  );
}
