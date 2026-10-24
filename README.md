# AlgoRhythm

**Learn the logic. Craft the solution.**

[![CI](https://github.com/suparnita-dev/algorhythm/actions/workflows/ci.yml/badge.svg)](https://github.com/suparnita-dev/algorhythm/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/live_demo-open-4f46e5)](https://dsa-platform-ten.vercel.app)

AlgoRhythm is a visual learning workspace for data structures and algorithms. Instead of reading a static explanation, learners can inspect each operation, follow synchronized pseudocode, test their intuition, and ask for targeted guidance.

**[Open the live demo](https://dsa-platform-ten.vercel.app)** · **[View the source](https://github.com/suparnita-dev/algorhythm)**

## What it includes

- **Visual algorithm workspaces** for arrays, strings, matrices, linked lists, stacks, queues, trees, graphs, Big O, recursion, and advanced topics.
- **Step-by-step execution** with play, pause, next, previous, reset, keyboard shortcuts, and adjustable playback speed.
- **Synchronized explanations** with highlighted pseudocode, operation details, complexity context, and visual state.
- **Practice and feedback** through lesson quizzes, score tracking, and progress summaries.
- **Optional tutoring** through a protected conversational route with an OpenAI provider and a deterministic local fallback.
- **Responsive, accessible UI** with visible focus states, reduced-motion support, light mode by default, and an optional dark theme.
- **Demo authentication** using signed HttpOnly sessions and scrypt password hashing.

## Local setup

Install dependencies and copy the environment template:

```powershell
cd .\dsa-platform
npm install
Copy-Item .env.example .env.local
```

Set `AUTH_SECRET` in `.env.local` to a long random value for signed sessions. Vercel deployments must define `AUTH_SECRET` in the project environment as well. Add an OpenAI key to enable live, multi-turn tutor responses. Without it, the local tutor fallback remains available for offline development.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```text
app/                 App Router entrypoint and API routes
components/           Workspace, visualization, code, and UI components
data/                 Curriculum metadata and quiz content
lib/algorithms/       Pure typed algorithm step builders
lib/server/           Server-only authentication helpers
stores/               Client state stores
types/                Shared TypeScript contracts
```

Algorithm builders are kept separate from presentation. Each builder returns typed, deterministic snapshots consumed by the workspace and visualization components.

## Backend routes

- `POST /api/auth/signup` creates a local demo user and signed session.
- `POST /api/auth/signin` starts a signed session for an existing demo user.
- `POST /api/auth/signout` ends the session.
- `GET /api/auth/me` returns the current user.
- `POST /api/tutor` sends a protected tutor request to OpenAI or the local fallback. The request can include `message`, `topic`, `step`, and up to 12 validated `messages` with `user`/`assistant` roles.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The Vitest suite covers algorithm snapshots, edge cases, Big O step counts, password hashing, and tampered sessions. CI runs linting, type-checking, unit tests, and the production build on every push and pull request.

## Deployment and security

Set a strong random `AUTH_SECRET` in production and configure `OPENAI_API_KEY` only as a server environment variable. Never commit `.env.local`, `AUTH_SECRET`, or OpenAI keys.

The current demo auth store is process-local and browser progress uses localStorage. This is suitable for demonstration and portfolio review, not durable multi-instance production use. Before scaling the application, replace it with durable persistence and server-authorized progress APIs. Add a distributed rate limiter if the tutor endpoint is exposed through multiple instances.

## Current limitations

- Account and progress data are not durable across server restarts or shared across devices.
- Analytics are currently derived from browser-local activity; there is no server-backed event history.
- The local tutor is a deterministic offline fallback. Open-ended provider responses require a valid server-side `OPENAI_API_KEY`.
- Tutor responses are not persisted and live-provider behavior is unverified without an API key.

## Deployment

The production demo is deployed on Vercel:

```text
https://dsa-platform-ten.vercel.app
```

For a new deployment, configure `AUTH_SECRET` in the Vercel Production environment before publishing. `OPENAI_API_KEY` is optional because the application includes an offline tutor fallback.
