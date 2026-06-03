export type Screen =
  | 'home'
  | 'prs'
  | 'templates'
  | 'template-builder'
  | 'opening'
  | 'builder'
  | 'execute'
  | 'additions'
  | 'summary';

export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'sled' | 'bodyweight';

export interface ExerciseDefinition {
  name: string;
  equipment: Equipment;
  startWeight: number;
}

export interface WorkoutExercise {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: Equipment;
  startWeight: number;
}

export interface WorkoutSet {
  weight: string;
  reps: string;
  rpe: string;
}

export interface CompletedExercise extends WorkoutExercise {
  sets: WorkoutSet[];
  date: string;
}

export interface CurrentExerciseData extends WorkoutExercise {
  sets: WorkoutSet[];
  lastWorkout?: CompletedExercise;
}

export interface Workout {
  date: string;
  exercises: CompletedExercise[];
  totalVolume: number;
  volumeByMuscleGroup: Record<string, number>;
  version: number;
}

export interface PersonalRecord {
  weight: number;
  reps: number;
  date: string;
}

export interface PRResult {
  exercise: string;
  weight: number;
  reps: number;
}

export interface Template {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface PlateConfig {
  plates45: number;
  plates25: number;
  plates10: number;
  plates5: number;
  plates2_5: number;
}
