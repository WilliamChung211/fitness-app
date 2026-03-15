import { Router } from "express";
import { getDb } from "../db/connection";

const router = Router();

// List all exercises
router.get("/", (_req, res) => {
  const exercises = getDb()
    .prepare("SELECT id, name FROM exercise ORDER BY name")
    .all();

  res.json(exercises);
});

export default router;
