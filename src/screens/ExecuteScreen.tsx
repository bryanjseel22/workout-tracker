import { ArrowLeft, X, Check, ChevronLeft } from 'lucide-react';
import PlateCalculator from '../components/PlateCalculator';
import { useState } from 'react';
import type { WorkoutExercise, WorkoutSet, CompletedExercise, PersonalRecord, Equipment } from '../types';

interface ExecuteScreenProps {
  exercise: WorkoutExercise;
  exerciseIndex: number;
  totalExercises: number;
  sets: WorkoutSet[];
  lastWorkout?: CompletedExercise;
  pr?: PersonalRecord;
  onUpdateSet: (index: number, field: keyof WorkoutSet, value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (index: number) => void;
  onDone: () => void;
  onPrevious: () => void;
}

const WEIGHT_LABEL: Record<Equipment, (sw: number) => string> = {
  barbell: sw => `Weight (bar ${sw}lb)`,
  sled: sw => `Weight (sled ${sw}lb)`,
  dumbbell: _ => 'Weight (per DB)',
  cable: _ => 'Pin/Stack',
  machine: _ => 'Weight/Pin',
  bodyweight: _ => 'Added Weight',
};

export default function ExecuteScreen({
  exercise,
  exerciseIndex,
  totalExercises,
  sets,
  lastWorkout,
  pr,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onDone,
  onPrevious,
}: ExecuteScreenProps) {
  const [calcSetIdx, setCalcSetIdx] = useState<number | null>(null);
  const showCalc = ['barbell', 'sled', 'dumbbell', 'machine'].includes(exercise.equipment);
  const weightLabel = WEIGHT_LABEL[exercise.equipment]?.(exercise.startWeight) ?? 'Weight';

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32">
      <div className="p-5 pt-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          {exerciseIndex > 0 && (
            <button onClick={onPrevious} className="text-zinc-400 hover:text-white" aria-label="Previous">
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-500 mb-0.5">
              {exerciseIndex + 1} / {totalExercises}
            </div>
            <h1 className="text-xl font-bold truncate">{exercise.name}</h1>
            <div className="text-sm text-zinc-500">{exercise.muscleGroup.replace(/_/g, ' ')} · {exercise.equipment}</div>
          </div>
        </div>

        {/* PR badge */}
        {pr && (
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-xl p-3 mb-4 flex justify-between items-center">
            <span className="text-xs text-yellow-500 font-semibold">Current PR</span>
            <span className="text-sm text-yellow-400 font-bold">{pr.weight} lbs × {pr.reps} reps</span>
          </div>
        )}

        {/* Last time */}
        {lastWorkout && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 mb-5">
            <div className="text-xs text-zinc-500 mb-2">Last time</div>
            <div className="flex flex-wrap gap-1.5">
              {lastWorkout.sets.map((s, i) => (
                <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-lg">
                  {s.weight} × {s.reps}
                  {s.rpe && <span className="text-yellow-500 ml-1">@{s.rpe}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sets */}
        <div className="space-y-3 mb-4">
          {sets.map((set, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-zinc-300">Set {idx + 1}</span>
                {sets.length > 1 && (
                  <button onClick={() => onRemoveSet(idx)} className="text-zinc-600 hover:text-red-400">
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">{weightLabel}</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    value={set.weight}
                    onChange={e => onUpdateSet(idx, 'weight', e.target.value)}
                    className="w-full bg-zinc-800 rounded-lg p-2.5 text-white text-center text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Reps</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={set.reps}
                    onChange={e => onUpdateSet(idx, 'reps', e.target.value)}
                    className="w-full bg-zinc-800 rounded-lg p-2.5 text-white text-center text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">RPE</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="1"
                    max="10"
                    value={set.rpe}
                    onChange={e => onUpdateSet(idx, 'rpe', e.target.value)}
                    className="w-full bg-zinc-800 rounded-lg p-2.5 text-white text-center text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="—"
                  />
                </div>
              </div>
              {showCalc && (
                <button
                  onClick={() => setCalcSetIdx(idx)}
                  className="w-full mt-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs py-2 rounded-lg"
                >
                  🧮 Plate Calculator
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onAddSet}
          className="w-full border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 py-3 rounded-xl text-sm"
        >
          + Add Set
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
        <button
          onClick={onDone}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Check size={20} />
          {exerciseIndex < totalExercises - 1 ? 'Next Exercise' : 'Finish Exercises'}
        </button>
      </div>

      {calcSetIdx !== null && (
        <PlateCalculator
          equipment={exercise.equipment}
          startWeight={exercise.startWeight}
          onApply={w => {
            onUpdateSet(calcSetIdx, 'weight', String(w));
            setCalcSetIdx(null);
          }}
          onClose={() => setCalcSetIdx(null)}
        />
      )}
    </div>
  );
}
