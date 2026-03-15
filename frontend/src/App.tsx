import { useState } from "react";
import WorkoutHistory from "./components/WorkoutHistory";
import ActiveWorkout from "./components/ActiveWorkout";
import "./App.css";

function App() {
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app">
      <h1>Fitness Tracker</h1>

      {activeWorkoutId ? (
        <ActiveWorkout
          workoutId={activeWorkoutId}
          onFinish={() => {
            setActiveWorkoutId(null);
            refresh();
          }}
        />
      ) : (
        <WorkoutHistory
          key={refreshKey}
          onStartWorkout={(id) => setActiveWorkoutId(id)}
        />
      )}
    </div>
  );
}

export default App;
