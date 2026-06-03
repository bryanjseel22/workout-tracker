import { Plus, Dumbbell, LayoutList, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Template } from '../types';

interface TemplatesScreenProps {
  templates: Template[];
  onNew: () => void;
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
  onStartWorkout: (template: Template) => void;
}

export default function TemplatesScreen({
  templates,
  onNew,
  onEdit,
  onDelete,
  onStartWorkout,
}: TemplatesScreenProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="p-6 pt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <button
            onClick={onNew}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl"
            aria-label="New template"
          >
            <Plus size={20} />
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LayoutList size={44} className="text-zinc-700 mb-4" />
            <p className="text-zinc-400 mb-1">No templates yet</p>
            <p className="text-zinc-600 text-sm mb-8">Save your go-to workouts here</p>
            <button
              onClick={onNew}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Plus size={18} />
              Create Template
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map(template => (
              <div key={template.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="font-bold text-lg">{template.name}</h2>
                      <p className="text-xs text-zinc-500">{template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit(template)}
                        className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setConfirmId(template.id)}
                        className="p-2 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded-lg"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.exercises.map((ex, i) => (
                      <span key={i} className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg">
                        {ex.name}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onStartWorkout(template)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Dumbbell size={18} />
                    Start Workout
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={onNew}
              className="w-full border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus size={18} />
              New Template
            </button>
          </div>
        )}
      </div>

      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-xs">
            <h3 className="font-bold text-lg mb-2">Delete template?</h3>
            <p className="text-zinc-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(confirmId); setConfirmId(null); }}
                className="flex-1 bg-red-700 hover:bg-red-600 py-3 rounded-xl text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
