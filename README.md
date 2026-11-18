# MySkillsGuru frontend

Next.js 16 (App Router, React 19, plain JavaScript) frontend for **MySkillsGuru**, an AI study companion for self-paced learners.

This is its own project (a trimmed copy of the LMS's learner screens). The LMS frontend (`lms-evaluation-frontend`) is **read-only reference material** and is never edited from here.

| | |
|---|---|
| Port | **3001** |
| Backend | `../myskillguru-backend` (port 5051) |
| Node | 20 or newer |

## Run it locally

Start the backend first (see its README), then:

```powershell
cd myskillguru-frontend
npm install              # first time only
npm run dev              # http://localhost:3001
```

Open <http://localhost:3001>. It redirects to the landing page at `/myskillguru`.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on 3001 |
| `npm run build` / `npm start` | Production build and server on 3001 |
| `npm run lint` | ESLint (`next lint` no longer exists in Next 16) |
| `npm run translate` | Regenerates the translation files |

## Settings (`.env`, git-ignored)

| Variable | Notes |
|---|---|
| `API_URL` | Where `/api/*` is proxied: `http://127.0.0.1:5051` for the MySkillsGuru backend. **Read at build time**: after changing it, restart `npm run dev` or rebuild. |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Profile-picture uploads. |

Anything starting with `NEXT_PUBLIC_` is sent to every visitor's browser. **Never put a private key there.** The ImageKit private key belongs only in the backend `.env`.

The browser talks to `/api/*` on this app, and Next rewrites those calls to the backend (`next.config.mjs`). Routers mounted under `/api` on the backend (roadmap, course material, AI tutor) have their own pass-through rules that must stay above the generic catch-all.

## Pages

| URL | What |
|---|---|
| `/myskillguru` | Public landing page |
| `/myskillguru/login`, `/myskillguru/register` | Public sign-in and sign-up (accounts are active immediately) |
| `/self-learner/dashboard` | Home after login |
| `/self-learner/roadmap`, `/learning-lounge` | Roadmaps and lessons |
| `/self-learner/self-review/*`, `/test-engine/*`, `/analytics` | Homework help, notes, quizzes, tests, analytics |
| `/self-learner/tools`, `/code-lab` | Tools hub and the Code Lab |

`/` redirects to `/myskillguru`, and `/myskillsguru` (with an s) redirects to `/myskillguru`. Public routes render immediately; everything else waits for the session check (`src/components/ProtectedRoute.js`).

## Code Lab

Learners write and run **Python and JavaScript in the browser**. Nothing runs on your servers.

- Code runs in a hidden `<iframe sandbox="allow-scripts">` (no cookies, storage or access to the app or its API) inside Web Workers. Python uses Pyodide, downloaded from a CDN on first use (about 10 MB).
- A run is stopped after 10 seconds (infinite loops) and its output is capped. Limits live in `src/lib/code-runner/config.js`.
- `src/lib/code-runner/` holds the config, the sandbox source and the `useCodeRunner` hook. `src/components/code-lab/CodeLabWorkspace.js` is the full UI, used by the Code Lab page and by the practice panel on technology lessons.
- To add a language, add it to `config.js` and give `sandbox.js` a matching runtime. C++ or Java would need a hosted runner instead.

New tools go in the `TOOLS` list in `src/app/self-learner/tools/page.js`; an entry without an `href` shows as "Coming soon".

## Things to know

- Use `http://localhost:3001` or `http://127.0.0.1:3001`; both are allowed (`allowedDevOrigins` in `next.config.mjs`).
- The login and register forms use `method="post"` so a submit before the page has loaded can never put the password in the URL.
- There are no privacy policy or terms pages yet. They must be added before a public launch.
- The brand is written **MySkillsGuru** on screen; routes and code identifiers stay `myskillguru`.
