# PKV — Ops Hub (local)

Quick start

- Install dependencies: `npm install`
- Start dev server: `npm run dev`

Notes

- Dev server binds to port 3010 by default (127.0.0.1:3010). If you use VS Code tasks the provided task also starts on 3010.
- The app supports dark mode via the theme toggle in the header (uses `next-themes`).

Where to edit tabs and APIs

- Tabs UI: `components/Tabs.jsx` and the tab pages/content are assembled in `pages/dashboard.js`.
- Agent UI: `components/AgentDock.jsx` (runs `POST /api/agent-run`).
- Best practices: `components/BestPractices.jsx` (fetches `/api/best-practices?channel=`).
- Ads/API mocks: `pages/api/ads.js` and Inventory: `pages/api/inventory.js` — replace these with real fetchers when integrating external services.

Kill & restart dev

- A VS Code compound/task is provided in `.vscode/tasks.json` that kills Node processes on the configured port and restarts the dev server. Use the `Kill & Restart Dev` task or run:

```powershell
# kill node.exe (Windows)
taskkill /F /IM node.exe
# then start
npm run dev
```

Contributing

- This repository is a local developer workspace. Keep UI changes in `components/` and route-level logic in `pages/`.
