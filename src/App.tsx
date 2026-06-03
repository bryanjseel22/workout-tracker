import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import PRScreen from './screens/PRScreen';
import TemplatesScreen from './screens/TemplatesScreen';
import TemplateBuilderScreen from './screens/TemplateBuilderScreen';
import OpeningScreen from './screens/OpeningScreen';
import BuilderScreen from './screens/BuilderScreen';
import ExecuteScreen from './screens/ExecuteScreen';
import AdditionsScreen from './screens/AdditionsScreen';
import SummaryScreen from './screens/SummaryScreen';

import type {
  Screen,
  Workout,
  WorkoutExercise,
  WorkoutSet,
  CompletedExercise,
  CurrentExerciseData,
  PersonalRecord,
  PRResult,
  Template,
} from './types';

const DATA_VERSION = 1;

function emptySet(): WorkoutSet {
  return { weight: '', reps: '', rpe: '' };
}

function calcVolume(exercises: CompletedExercise[]) {
  return exercises.reduce((t, ex) =>
    t + ex.sets.reduce((s, set) =>
      s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0);
}

function calcVolumeByGroup(exercises: CompletedExercise[]) {
  const v: Record<string, number> = {};
  exercises.forEach(ex => {
    const vol = ex.sets.reduce((s, set) =>
      s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0);
    v[ex.muscleGroup] = (v[ex.muscleGroup] ?? 0) + vol;
  });
  return v;
}

export default function App() {
  // Persistent state
  const [workoutHistory, setWorkoutHistory] = useLocalStorage<Workout[]>('workout-history', []);
  const [personalRecords, setPersonalRecords] = useLocalStorage<Record<string, PersonalRecord>>('personal-records', {});
  const [templates, setTemplates] = useLocalStorage<Template[]>('workout-templates', []);

  // Navigation
  const [screen, setScreen] = useState<Screen>('home');
  const [viewingWorkout, setViewingWorkout] = useState<Workout | null>(null);
  const [templateBackTarget, setTemplateBackTarget] = useState<Screen>('home');

  // Active workout state
  const [workoutDate, setWorkoutDate] = useState('');
  const [plannedExercises, setPlannedExercises] = useState<WorkoutExercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentExData, setCurrentExData] = useState<CurrentExerciseData | null>(null);
  const [exDataCache, setExDataCache] = useState<Record<number, CurrentExerciseData>>({});
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [newPRs, setNewPRs] = useState<PRResult[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [finishedWorkout, setFinishedWorkout] = useState<Workout | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Workout | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function initExData(exercise: WorkoutExercise, idx: number, overrideCache?: Record<number, CurrentExerciseData>) {
    const cache = overrideCache ?? exDataCache;
    if (cache[idx]) {
      setCurrentExData(cache[idx]);
      return;
    }
    const last = workoutHistory
      .flatMap(w => w.exercises)
      .filter(e => e.name === exercise.name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const numSets = last ? last.sets.length : 3;
    setCurrentExData({
      ...exercise,
      sets: Array(numSets).fill(null).map(emptySet),
      lastWorkout: last,
    });
  }

  function checkPRs(exerciseName: string, sets: WorkoutSet[]): PRResult[] {
    const found: PRResult[] = [];
    const cur = personalRecords[exerciseName];
    sets.forEach(set => {
      const w = parseFloat(set.weight);
      const r = parseInt(set.reps);
      if (!w || !r || w > 2000 || r > 200) return;
      const better = !cur || w > cur.weight || (w === cur.weight && r > cur.reps);
      if (!better) return;
      const existing = found.findIndex(p => p.exercise === exerciseName);
      if (existing >= 0) {
        if (w > found[existing].weight || (w === found[existing].weight && r > found[existing].reps)) {
          found[existing] = { exercise: exerciseName, weight: w, reps: r };
        }
      } else {
        found.push({ exercise: exerciseName, weight: w, reps: r });
      }
    });
    return found;
  }

  // ── Workout flow ──────────────────────────────────────────────────────────

  function startWorkout() {
    setWorkoutDate(new Date().toISOString().split('T')[0]);
    setPlannedExercises([]);
    setCompletedExercises([]);
    setExDataCache({});
    setNewPRs([]);
    setCurrentIdx(0);
    setScreen('opening');
  }

  function startFromTemplate(template: Template) {
    const today = new Date().toISOString().split('T')[0];
    const exercises = template.exercises.map((ex, i) => ({ ...ex, id: Date.now() + i }));
    const last = workoutHistory
      .flatMap(w => w.exercises)
      .filter(e => e.name === exercises[0].name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const numSets = last ? last.sets.length : 3;

    setWorkoutDate(today);
    setPlannedExercises(exercises);
    setCompletedExercises([]);
    setExDataCache({});
    setNewPRs([]);
    setCurrentIdx(0);
    setCurrentExData({ ...exercises[0], sets: Array(numSets).fill(null).map(emptySet), lastWorkout: last });
    setScreen('execute');
  }

  function handleDone() {
    if (!currentExData) return;
    const validSets = currentExData.sets.filter(s => s.weight && s.reps);
    if (validSets.length === 0) return;

    const completed: CompletedExercise = {
      ...plannedExercises[currentIdx],
      sets: validSets,
      date: workoutDate,
    };
    const updatedCompleted = [...completedExercises, completed];
    setCompletedExercises(updatedCompleted);

    const prs = checkPRs(completed.name, validSets);
    if (prs.length > 0) {
      const updated = { ...personalRecords };
      prs.forEach(pr => { updated[pr.exercise] = { weight: pr.weight, reps: pr.reps, date: workoutDate }; });
      setPersonalRecords(updated);
      setNewPRs(prev => [...prev, ...prs]);
    }

    const updatedCache = { ...exDataCache, [currentIdx]: currentExData };
    setExDataCache(updatedCache);

    if (currentIdx < plannedExercises.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      initExData(plannedExercises[next], next, updatedCache);
    } else {
      setScreen('additions');
    }
  }

  function handlePrevious() {
    if (currentIdx === 0 || !currentExData) return;
    const updatedCache = { ...exDataCache, [currentIdx]: currentExData };
    setExDataCache(updatedCache);
    const prev = currentIdx - 1;
    setCurrentIdx(prev);
    initExData(plannedExercises[prev], prev, updatedCache);
  }

  function finishWorkout() {
    const workout: Workout = {
      date: workoutDate,
      exercises: completedExercises,
      totalVolume: calcVolume(completedExercises),
      volumeByMuscleGroup: calcVolumeByGroup(completedExercises),
      version: DATA_VERSION,
    };
    setFinishedWorkout(workout);
    setWorkoutHistory(prev => [workout, ...prev]);
    setScreen('summary');
  }

  function resetWorkout() {
    setPlannedExercises([]);
    setCompletedExercises([]);
    setExDataCache({});
    setNewPRs([]);
    setFinishedWorkout(null);
    setCurrentIdx(0);
    setCurrentExData(null);
    setScreen('home');
  }

  function updateSet(idx: number, field: keyof WorkoutSet, value: string) {
    if (!currentExData) return;
    const newSets = [...currentExData.sets];
    newSets[idx] = { ...newSets[idx], [field]: value };
    setCurrentExData({ ...currentExData, sets: newSets });
  }

  // ── Template operations ───────────────────────────────────────────────────

  function handleSaveTemplate(name: string, exercises: WorkoutExercise[]) {
    const template: Template = {
      id: editingTemplate?.id ?? Date.now(),
      name,
      exercises,
    };
    setTemplates(prev =>
      editingTemplate ? prev.map(t => t.id === editingTemplate.id ? template : t) : [...prev, template]
    );
    setEditingTemplate(null);
    setScreen('templates');
  }

  // ── Workout delete ────────────────────────────────────────────────────────

  function handleDeleteWorkout(workout: Workout) {
    setWorkoutHistory(prev => prev.filter(w => w !== workout));
    setViewingWorkout(null);
    setDeleteConfirm(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const hideNav = ['opening', 'builder', 'execute', 'additions', 'summary'].includes(screen);

  return (
    <div className="max-w-md mx-auto relative">
      {/* Screens */}
      {viewingWorkout ? (
        <WorkoutDetailScreen
          workout={viewingWorkout}
          onBack={() => setViewingWorkout(null)}
          onDelete={w => setDeleteConfirm(w)}
        />
      ) : (
        <>
          {screen === 'home' && (
            <HomeScreen
              workoutHistory={workoutHistory}
              onViewWorkout={setViewingWorkout}
              onStartWorkout={startWorkout}
            />
          )}
          {screen === 'prs' && (
            <PRScreen
              workoutHistory={workoutHistory}
              personalRecords={personalRecords}
            />
          )}
          {screen === 'templates' && (
            <TemplatesScreen
              templates={templates}
              onNew={() => { setEditingTemplate(null); setScreen('template-builder'); }}
              onEdit={t => { setEditingTemplate(t); setScreen('template-builder'); }}
              onDelete={id => setTemplates(prev => prev.filter(t => t.id !== id))}
              onStartWorkout={startFromTemplate}
            />
          )}
          {screen === 'template-builder' && (
            <TemplateBuilderScreen
              editing={editingTemplate}
              onSave={handleSaveTemplate}
              onBack={() => setScreen('templates')}
            />
          )}
          {screen === 'opening' && (
            <OpeningScreen
              workoutDate={workoutDate}
              templates={templates}
              onDateChange={setWorkoutDate}
              onFreeform={() => setScreen('builder')}
              onFromTemplate={() => {
                setTemplateBackTarget('opening');
                setScreen('templates');
              }}
            />
          )}
          {screen === 'builder' && (
            <BuilderScreen
              exercises={plannedExercises}
              onAdd={ex => setPlannedExercises(prev => [...prev, ex])}
              onRemove={id => setPlannedExercises(prev => prev.filter(e => e.id !== id))}
              onStart={() => {
                if (plannedExercises.length === 0) return;
                setCurrentIdx(0);
                const emptyCache: Record<number, CurrentExerciseData> = {};
                setExDataCache(emptyCache);
                initExData(plannedExercises[0], 0, emptyCache);
                setScreen('execute');
              }}
              onBack={() => setScreen('opening')}
            />
          )}
          {screen === 'execute' && currentExData && (
            <ExecuteScreen
              exercise={plannedExercises[currentIdx]}
              exerciseIndex={currentIdx}
              totalExercises={plannedExercises.length}
              sets={currentExData.sets}
              lastWorkout={currentExData.lastWorkout}
              pr={personalRecords[plannedExercises[currentIdx].name]}
              onUpdateSet={updateSet}
              onAddSet={() => setCurrentExData(d => d ? { ...d, sets: [...d.sets, emptySet()] } : d)}
              onRemoveSet={idx => {
                if (!currentExData || currentExData.sets.length <= 1) return;
                setCurrentExData(d => d ? { ...d, sets: d.sets.filter((_, i) => i !== idx) } : d);
              }}
              onDone={handleDone}
              onPrevious={handlePrevious}
            />
          )}
          {screen === 'additions' && (
            <AdditionsScreen
              completedCount={completedExercises.length}
              onAddMore={() => setScreen('builder')}
              onFinish={finishWorkout}
            />
          )}
          {screen === 'summary' && finishedWorkout && (
            <SummaryScreen
              workout={finishedWorkout}
              newPRs={newPRs}
              onDone={resetWorkout}
            />
          )}
        </>
      )}

      {/* Bottom nav — hide during active workout flow */}
      {!viewingWorkout && !hideNav && (
        <BottomNav
          currentScreen={screen}
          onNavigate={s => {
            if (s === 'templates') setTemplateBackTarget('home');
            setScreen(s);
          }}
          onStartWorkout={startWorkout}
        />
      )}

      {/* Delete workout confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-xs">
            <h3 className="font-bold text-lg mb-2">Delete workout?</h3>
            <p className="text-zinc-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteWorkout(deleteConfirm)}
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
