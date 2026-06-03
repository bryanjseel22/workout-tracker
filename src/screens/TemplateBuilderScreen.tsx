import { useState } from 'react';
import { ArrowLeft, X, Check } from 'lucide-react';
import ExercisePicker from '../components/ExercisePicker';
import type { Template, WorkoutExercise, ExerciseDefinition } from '../types';

interface TemplateBuilderScreenProps {
  editing: Template | null;
  onSave: (name: string, exercises: WorkoutExercise[]) => void;
  onBack: () => void;
}

export default function TemplateBuilderScreen({ editing, onSave, onBack }: TemplateBuilderScreenProps) {
  const [name, setName] = useState(editing?.name ?? '');
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    editing?.exercises.map((ex, i) => ({ ...ex, id: ex.id || Date.now() + i })) ?? []
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [error, setError] = useState('');

  const addExercise = (ex: ExerciseDefinition, muscleGroup: string) => {
    setExercises(prev => [
      ...prev,
      { id: Date.now(), name: ex.name, muscleGroup, equipment: ex.equipment, startWeight: ex.startWeight },
    ]);
    setPickerOpen(false);
    setSelectedGroup(null);
  };

  const remove = (id: number) => setExercises(prev => prev.filter(e => e.id !== id));

  const handleSave = () => {
    if (!name.trim()) { setError('Give your template a name.'); return; }
    if (exercises.length === 0) { setError('Add at least one exercise.'); return; }
    onSave(name.trim(), exercises);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32">
      <div className="p-6 pt-10">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-zinc-400 hover:text-white" aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold">{editing ? 'Edit Template' : 'New Template'}</h1>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-xl p-3 mb-4 flex justify-between">
            {error}
            <button onClick={() => setError('')}><X size={16} /></button>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5">
          <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wide">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Push Day A"
            className="w-full bg-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {exercises.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Exercises</h2>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{i + 1}. {ex.name}</div>
                    <div className="text-xs text-zinc-500">{ex.muscleGroup.replace(/_/g, ' ')} · {ex.equipment}</div>
                  </div>
                  <button onClick={() => remove(ex.id)} className="text-zinc-600 hover:text-red-400 p-1">
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

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Save Template
        </button>
      </div>

      {pickerOpen && (
        <ExercisePicker
          selectedMuscleGroup={selectedGroup}
          onSelect={addExercise}
          onSelectMuscleGroup={setSelectedGroup}
          onClose={() => { setPickerOpen(false); setSelectedGroup(null); }}
        />
      )}
    </div>
  );
}
