import type Database from "better-sqlite3";

const EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-up",
  "Dip",
  "Lat Pulldown",
  "Leg Press",
  "Romanian Deadlift",
  "Incline Bench Press",
  "Cable Row",
  "Lateral Raise",
  "Bicep Curl",
  "Tricep Pushdown",
];

export function seedExercises(db: Database.Database): void {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO exercise (name) VALUES (?)"
  );

  const tx = db.transaction(() => {
    for (const name of EXERCISES) {
      insert.run(name);
    }
  });

  tx();
}
