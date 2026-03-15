import { useEffect, useState } from "react";
import { api, type Workout } from "../api";

interface Props {
  onStartWorkout: (id: number) => void;
}

export default function WorkoutHistory({ onStartWorkout }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    api.getWorkouts().then(setWorkouts);
  }, []);

  const handleStart = async () => {
    const workout = await api.startWorkout();
    onStartWorkout(workout.id);
  };

  const handleDelete = async (id: number) => {
    await api.deleteWorkout(id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const formatDate = (iso: string) => {
    return new Date(iso + "Z").toLocaleString();
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={handleStart}>Start Workout</button>
      </div>

      <h2>Workout History</h2>

      {workouts.length === 0 && <p>No workouts yet. Start one!</p>}

      {workouts.map((w) => (
        <div key={w.id} className="workout-card">
          <div className="info">
            <strong>Workout #{w.id}</strong>
            <br />
            {formatDate(w.started_at)}
            {w.ended_at ? " — completed" : " — in progress"}
          </div>
          <div className="actions">
            {!w.ended_at && (
              <button onClick={() => onStartWorkout(w.id)}>Resume</button>
            )}
            <button className="danger" onClick={() => handleDelete(w.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
