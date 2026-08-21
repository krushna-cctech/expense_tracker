# Expense Tracker

An expense tracker delivered as two clients backed by one shared API:

1. **Progressive Web App (PWA)** — installable, offline-capable React app; the primary interface.
2. **Browser Extension** — a companion for capturing expenses quickly from any web page.
3. **Server API** — a Node + Express service persisting data in MongoDB, shared by both clients.

## Tech Stack
- **Language:** TypeScript (all packages)
- **Frontend:** React (PWA + extension)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Layout:** monorepo under `src/`

## Repository Layout
```
.
├── AGENTS.md                 # Coding-agent guide (read first)
├── .agents/                  # Agent configuration
│   ├── workingrules.md       # Rules the agent follows on every task
│   ├── skills/               # Reusable SKILL files
│   └── memory/               # Agent memory
├── docs/
│   ├── devenv.md             # Developer environment setup
│   ├── specifications/       # Requirements and specs (see specindex.md)
│   └── design/               # ARCHITECTURE.md + ADR.md
├── src/
│   ├── pwa/                  # Progressive Web App (React + TS)
│   ├── extension/            # Browser extension (React + TS)
│   ├── server/               # API (Node + Express + MongoDB)
│   └── shared/               # Shared types, validation, utilities
└── test/                     # Test plans, unit tests, test data
```

## Getting Started
1. Read the architecture: [`docs/design/ARCHITECTURE.md`](docs/design/ARCHITECTURE.md).
2. Set up your environment: [`docs/devenv.md`](docs/devenv.md).
3. Review decisions: [`docs/design/ADR.md`](docs/design/ADR.md).

## Documentation
- **Agent guide:** [`AGENTS.md`](AGENTS.md)
- **Working rules:** [`.agents/workingrules.md`](.agents/workingrules.md)
- **Skills index:** [`.agents/skills/skills.md`](.agents/skills/skills.md)
- **Architecture:** [`docs/design/ARCHITECTURE.md`](docs/design/ARCHITECTURE.md)
- **Decision records:** [`docs/design/ADR.md`](docs/design/ADR.md)
- **Specifications:** [`docs/specifications/specindex.md`](docs/specifications/specindex.md)

## Status
Early scaffolding. The product is built in phases (see the phasing plan in `ARCHITECTURE.md`):
1. Server API + MongoDB with expense CRUD.
2. PWA consuming the API.
3. PWA offline support.
4. Browser extension for quick capture.
5. Categories, reporting, and authentication.

## Vercel Deployment
Deploy the PWA and API from the repository root. `vercel.json` builds
`src/pwa/dist`, while `api/index.ts` exposes the Express API under `/api/*`.

Set these Vercel environment variables for the deployment environments:

- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — long random production secret
- `JWT_EXPIRES_IN` — optional, defaults to `7d`
- `CORS_ORIGINS` — deployed PWA URL, such as `https://app.example.com`

Leave `VITE_API_URL` unset for the PWA so it uses the same-origin `/api` path.
The browser extension is built separately with the deployed API URL:

```powershell
$env:VITE_API_URL = 'https://<your-domain>'
npm run build:shared
npm run build -w @expense-tracker/extension
```

Load `src/extension/dist` as an unpacked extension for testing, or publish it
through the Chrome Web Store / Firefox Add-ons. Vercel can host the extension
files as a separate static project, but cannot install the extension in a
browser.

## Contributing
This project is developed with a coding agent. Before making changes, read [`AGENTS.md`](AGENTS.md) and follow [`.agents/workingrules.md`](.agents/workingrules.md).
