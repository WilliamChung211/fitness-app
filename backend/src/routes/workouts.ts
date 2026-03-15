import { Router } from "express";
import { getDb } from "../db/connection";

const router = Router();

// List all workouts
router.get("/", (_req, res) => {
  const workouts = getDb()
    .prepare("SELECT * FROM workout ORDER BY started_at DESC")
    .all();

  res.json(workouts);
});

// Get a single workout with exercises and sets
router.get("/:id", (req, res) => {
  const db = getDb();
  const workout = db
    .prepare("SELECT * FROM workout WHERE id = ?")
    .get(req.params.id);

  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  const exercises = db
    .prepare(
      `SELECT we.id as workout_exercise_id, e.id as exercise_id, e.name
       FROM workout_exercise we
       JOIN exercise e ON e.id = we.exercise_id
       WHERE we.workout_id = ?`
    )
    .all(req.params.id);

  const sets = db
    .prepare(
      `SELECT s.id, s.workout_exercise_id, s.weight, s.reps, s.set_index
       FROM set_entry s
       JOIN workout_exercise we ON we.id = s.workout_exercise_id
       WHERE we.workout_id = ?
       ORDER BY s.workout_exercise_id, s.set_index`
    )
    .all(req.params.id);

  res.json({ ...workout, exercises, sets });
});

// Start a new workout
router.post("/", (_req, res) => {
  const result = getDb()
    .prepare("INSERT INTO workout DEFAULT VALUES")
    .run();

  const workout = getDb()
    .prepare("SELECT * FROM workout WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(workout);
});

// End a workout
router.patch("/:id", (req, res) => {
  const db = getDb();
  const workout = db
    .prepare("SELECT * FROM workout WHERE id = ?")
    .get(req.params.id);

  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  db.prepare("UPDATE workout SET ended_at = datetime('now') WHERE id = ?")
    .run(req.params.id);

  const updated = db
    .prepare("SELECT * FROM workout WHERE id = ?")
    .get(req.params.id);

  res.json(updated);
});

// Add an exercise to a workout
router.post("/:id/exercises", (req, res) => {
  const db = getDb();
  const { exercise_id } = req.body;

  if (!exercise_id) {
    res.status(400).json({ error: "exercise_id is required" });
    return;
  }

  const workout = db
    .prepare("SELECT * FROM workout WHERE id = ?")
    .get(req.params.id);

  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  const exercise = db
    .prepare("SELECT * FROM exercise WHERE id = ?")
    .get(exercise_id);

  if (!exercise) {
    res.status(404).json({ error: "Exercise not found" });
    return;
  }

  const result = db
    .prepare(
      "INSERT INTO workout_exercise (workout_id, exercise_id) VALUES (?, ?)"
    )
    .run(req.params.id, exercise_id);

  res.status(201).json({
    workout_exercise_id: result.lastInsertRowid,
    workout_id: Number(req.params.id),
    exercise_id,
  });
});

// Log a set
router.post("/:id/exercises/:workoutExerciseId/sets", (req, res) => {
  const db = getDb();
  const { weight, reps } = req.body;

  if (weight == null || reps == null) {
    res.status(400).json({ error: "weight and reps are required" });
    return;
  }

  const workoutExercise = db
    .prepare(
      "SELECT * FROM workout_exercise WHERE id = ? AND workout_id = ?"
    )
    .get(req.params.workoutExerciseId, req.params.id);

  if (!workoutExercise) {
    res.status(404).json({ error: "Workout exercise not found" });
    return;
  }

  // Auto-increment set_index
  const lastSet = db
    .prepare(
      `SELECT MAX(set_index) as max_index
       FROM set_entry WHERE workout_exercise_id = ?`
    )
    .get(req.params.workoutExerciseId) as { max_index: number | null };

  const setIndex = (lastSet.max_index ?? -1) + 1;

  const result = db
    .prepare(
      `INSERT INTO set_entry (workout_exercise_id, weight, reps, set_index)
       VALUES (?, ?, ?, ?)`
    )
    .run(req.params.workoutExerciseId, weight, reps, setIndex);

  res.status(201).json({
    id: result.lastInsertRowid,
    workout_exercise_id: Number(req.params.workoutExerciseId),
    weight,
    reps,
    set_index: setIndex,
  });
});

export default router;
