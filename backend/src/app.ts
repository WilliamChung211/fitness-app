import express from "express";
import { getDb } from "./db/connection";
import { initSchema } from "./db/schema";
import { seedExercises } from "./db/seed";
import healthRouter from "./routes/health";

// Initialize database
const db = getDb();
initSchema(db);
seedExercises(db);

const app = express();

app.use(express.json());
app.use("/health", healthRouter);

export default app;
