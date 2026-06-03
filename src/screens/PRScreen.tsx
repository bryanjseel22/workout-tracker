import type { Workout, PersonalRecord } from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';

interface PRScreenProps {
  workoutHistory: Workout[];
  personalRecords: Record<string, PersonalRecord>;
}

export default function PRScreen({ workoutHistory, personalRecords }: PRScreenProps) {
  const allHistory = workoutHistory.flatMap(w => w.exercises);
  const doneName = new Set(allHistory.map(e => e.name));

  const allExercises = Object.entries(EXERCISE_LIBRARY).flatMap(([group, exs]) =>
    exs.map(ex => ({ ...ex, muscleGroup: group }))
  );

  const done = allExercises.filter(ex => doneName.has(ex.name)).sort((a, b) => a.name.localeCompare(b.name));
  const notDone = allExercises.filter(ex => !doneName.has(ex.name)).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="p-6 pt-10">
        <h1 className="text-2xl font-bold mb-6">Personal Records</h1>

        {done.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Logged</h2>
            <div className="space-y-3 mb-8">
              {done.map(exercise => {
                const pr = personalRecords[exercise.name];
                const history = allHistory
                  .filter(e => e.name === exercise.name)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                return (
                  <div key={exercise.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold">{exercise.name}</div>
                        <div className="text-xs text-zinc-500">{exercise.muscleGroup.replace(/_/g, ' ')}</div>
                      </div>
                      {pr && (
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">{pr.weight} × {pr.reps}</div>
                          <div className="text-xs text-zinc-500">PR · {new Date(pr.date + 'T12:00:00').toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-zinc-800 pt-3 space-y-2">
                      {history.slice(0, 4).map((session, i) => (
                        <div key={i} className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-xs text-zinc-600 w-16 shrink-0">
                            {new Date(session.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          {session.sets.map((set, j) => (
                            <span
                              key={j}
                              className={`text-xs px-2 py-0.5 rounded ${
                                pr && parseFloat(set.weight) === pr.weight && parseInt(set.reps) === pr.reps
                                  ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {set.weight}×{set.reps}
                              {set.rpe && <span className="text-yellow-500"> @{set.rpe}</span>}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <h2 className="text-sm font-semibold text-zinc-600 uppercase tracking-wide mb-3">Not Yet Logged</h2>
        <div className="space-y-2">
          {notDone.map(ex => (
            <div key={ex.name} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 flex justify-between items-center opacity-50">
              <div>
                <div className="font-medium text-sm text-zinc-400">{ex.name}</div>
                <div className="text-xs text-zinc-600">{ex.muscleGroup.replace(/_/g, ' ')} · {ex.equipment}</div>
              </div>
              <div className="text-xs text-zinc-700">—</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
