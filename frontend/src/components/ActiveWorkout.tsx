import { useEffect, useState } from "react";
import {
  api,
  type Exercise,
  type WorkoutDetail,
} from "../api";

interface Props {
  workoutId: number;
  onFinish: () => void;
}

export default function ActiveWorkout({ workoutId, onFinish }: Props) {
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number>(0);

  const reload = () => api.getWorkout(workoutId).then(setWorkout);

  useEffect(() => {
    reload();
    api.getExercises().then((list) => {
      setExercises(list);
      if (list.length > 0) setSelectedExerciseId(list[0].id);
    });
  }, [workoutId]);

  const handleAddExercise = async () => {
    if (!selectedExerciseId) return;
    await api.addExercise(workoutId, selectedExerciseId);
    reload();
  };

  const handleFinish = async () => {
    await api.endWorkout(workoutId);
    onFinish();
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <div>
      <div className="toolbar">
        <button className="secondary" onClick={onFinish}>
          Back
        </button>
        <button onClick={handleFinish}>Finish Workout</button>
      </div>

      <h2>Workout #{workout.id}</h2>

      <div className="add-exercise-row">
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddExercise}>Add Exercise</button>
      </div>

      {workout.exercises.map((we) => (
        <ExerciseSection
          key={we.workout_exercise_id}
          workoutId={workoutId}
          workoutExerciseId={we.workout_exercise_id}
          name={we.name}
          sets={workout.sets.filter(
            (s) => s.workout_exercise_id === we.workout_exercise_id
          )}
          onSetLogged={reload}
        />
      ))}
    </div>
  );
}

function ExerciseSection({
  workoutId,
  workoutExerciseId,
  name,
  sets,
  onSetLogged,
}: {
  workoutId: number;
  workoutExerciseId: number;
  name: string;
  sets: { weight: number; reps: number; set_index: number }[];
  onSetLogged: () => void;
}) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleLog = async () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (isNaN(w) || isNaN(r)) return;

    await api.logSet(workoutId, workoutExerciseId, w, r);
    setWeight("");
    setReps("");
    onSetLogged();
  };

  return (
    <div className="exercise-section">
      <h3>{name}</h3>

      {sets.map((s) => (
        <div key={s.set_index} className="set-row">
          <span>Set {s.set_index + 1}:</span>
          <span>{s.weight} lbs</span>
          <span>{s.reps} reps</span>
        </div>
      ))}

      <div className="set-row">
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <button onClick={handleLog}>Log Set</button>
      </div>
    </div>
  );
}
