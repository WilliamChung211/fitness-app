# Running Locally

You need two terminals running at the same time — one for the backend, one for the frontend.

## Start the backend

```bash
cd backend
npm run dev
```

You should see: `Server running on http://localhost:3000`

## Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

Vite will print a URL (usually http://localhost:5173). Open it in your browser.

## Using the app

1. Click **Start Workout**
2. Pick an exercise from the dropdown and click **Add Exercise**
3. Enter weight and reps, click **Log Set** (repeat for each set)
4. Click **Finish Workout** when done
5. Past workouts appear on the home page

## Stopping the app

Press `Ctrl+C` in each terminal.

## Troubleshooting

**`npm` not found?**
Make sure Node.js is installed and restart your terminal. On Git Bash you may need:
```bash
export PATH="$PATH:/c/Program Files/nodejs"
```

**Port already in use?**
A previous server is still running. Close all terminals and reopen, or restart VS Code.
