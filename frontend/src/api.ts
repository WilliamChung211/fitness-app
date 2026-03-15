const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

export interface Exercise {
  id: number;
  name: string;
}

export interface Workout {
  id: number;
  started_at: string;
  ended_at: string | null;
}

export interface WorkoutExercise {
  workout_exercise_id: number;
  exercise_id: number;
  name: string;
}

export interface SetEntry {
  id: number;
  workout_exercise_id: number;
  weight: number;
  reps: number;
  set_index: number;
}

export interface WorkoutDetail extends Workout {
  exercises: WorkoutExercise[];
  sets: SetEntry[];
}

export const api = {
  getExercises: () => request<Exercise[]>("/exercises"),
  getWorkouts: () => request<Workout[]>("/workouts"),
  getWorkout: (id: number) => request<WorkoutDetail>(`/workouts/${id}`),
  startWorkout: () => request<Workout>("/workouts", { method: "POST" }),
  endWorkout: (id: number) => request<Workout>(`/workouts/${id}`, { method: "PATCH" }),
  deleteWorkout: (id: number) => request<void>(`/workouts/${id}`, { method: "DELETE" }),
  addExercise: (workoutId: number, exerciseId: number) =>
    request<{ workout_exercise_id: number }>(`/workouts/${workoutId}/exercises`, {
      method: "POST",
      body: JSON.stringify({ exercise_id: exerciseId }),
    }),
  logSet: (workoutId: number, workoutExerciseId: number, weight: number, reps: number) =>
    request<SetEntry>(`/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`, {
      method: "POST",
      body: JSON.stringify({ weight, reps }),
    }),
};
