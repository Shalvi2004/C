# ChatApp — Frontend (chat)

This folder contains the frontend of ChatApp — a Vite + React UI for community and private chat features.

Key points
- Framework: React (Vite)
- Location: `chat/`
- Main files: `src/main.jsx`, `src/App.jsx`, styles in `src/index.css`, components in `src/components/`

Features (UI-level)
- Community and private chat views
- Components for Chat, Community, CreateToken, Info, Private, TechTalk, Welcome
- Static assets in `src/assets/`

Quick setup
1. Make sure Node.js (14+) and npm are installed.
2. From the `chat` folder install dependencies and start the dev server:

```bash
# from project root
cd chat
npm install
npm run dev
```

Notes
- Vite typically serves on `http://localhost:5173` by default. If you need the frontend to talk to the backend, set a Vite environment variable with the `VITE_` prefix (see below).
- Example env variable for backend URL (create a `.env` in `chat/`):

```
VITE_API_URL=http://localhost:5000
```

Build and preview

```bash
cd chat
npm run build
npm run preview
```

Assumptions and notes
- I created this README from the repository layout and component names. I assume the project uses the typical Vite + React scripts in `package.json` (e.g., `dev`, `build`, `preview`). If your `package.json` uses different script names, run the corresponding scripts instead.
- For production deployments, configure the `VITE_API_URL` to point to your hosted server.

Contributing
- Please follow the repository's contribution guidelines in the root `README.md` (if present). Create small PRs for UI and feature changes and include screenshots where helpful.

License
- Inherit the repository's license (check root `LICENSE` or `package.json`).
