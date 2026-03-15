import express from "express";
import { getDb } from "./db/connection";
import { initSchema } from "./db/schema";
import { seedExercises } from "./db/seed";
import exercisesRouter from "./routes/exercises";
import healthRouter from "./routes/health";
import workoutsRouter from "./routes/workouts";

// Initialize database
const db = getDb();
initSchema(db);
seedExercises(db);

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/exercises", exercisesRouter);
app.use("/workouts", workoutsRouter);

export default app;
