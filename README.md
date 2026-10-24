# AlgoRhythm

**Visualize. Understand. Practice. Master.**

AlgoRhythm is an interactive data-structures and algorithms workspace. It turns algorithm execution into inspectable steps with synchronized pseudocode, visual state, complexity context, quizzes, and an optional AI tutor.

## Implemented features

- Interactive workspaces for arrays, strings, matrices, linked lists, stacks, queues, trees, graphs, Big O, and advanced learning topics.
- Deterministic execution steps with play, pause, next, previous, reset, keyboard shortcuts, and adjustable playback speed.
- Synchronized code-line highlighting and operation-focused visualization panels.
- Local progress, theme preference, quiz attempts, and best score persistence for the current browser.
- Server-side demo authentication with signed HttpOnly sessions and scrypt password hashing.
- Protected conversational tutor route with up to 12 recent messages, current workspace context, provider error fallback, and deterministic local guidance when `OPENAI_API_KEY` is unavailable.
- Responsive shell with dark developer-tool styling, visible focus states, and reduced-motion support.

## Local setup

Install dependencies and copy the environment template:

```powershell
cd .\dsa-platform
npm install
Copy-Item .env.example .env.local
```

Set `AUTH_SECRET` in `.env.local` to a long random value for signed sessions. Add an OpenAI key to enable live, multi-turn tutor responses; without it, the local tutor fallback remains available but is intentionally limited and is not equivalent to a hosted generative model.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

```text
app/                 App Router entrypoint and API routes
components/           Workspace, visualization, code, and UI components
data/                 Curriculum metadata and quiz content
lib/algorithms/       Pure typed algorithm step builders
lib/server/           Server-only authentication helpers
stores/               Client state stores
types/                Shared TypeScript contracts
```

The algorithm builders are kept separate from presentation. Each builder returns typed, deterministic snapshots consumed by the workspace and visualization components.

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

The Vitest suite covers algorithm snapshots, edge cases, Big O step counts, password hashing, and tampered sessions. Browser-level verification should still cover authentication screens, playback controls, quiz completion, malformed local storage, conversational tutor history, and provider fallback behavior.

## Deployment and security

Set a strong random `AUTH_SECRET` in production and configure `OPENAI_API_KEY` only as a server environment variable. Never commit `.env.local`, `AUTH_SECRET`, or OpenAI keys.

The current demo auth store is process-local and browser progress uses localStorage. This is suitable for demonstration and local development, not durable multi-instance production use. Before production deployment, replace it with durable persistence and server-authorized progress APIs. Add a distributed rate limiter if the tutor endpoint is exposed through multiple instances.

## Known limitations and roadmap

- Account and progress data are not durable across server restarts or shared across devices.
- Analytics are currently derived from browser-local activity; there is no server-backed event history.
- The local tutor is a deterministic offline fallback. ChatGPT/Claude-like open-ended responses require a valid server-side `OPENAI_API_KEY`; the application does not fabricate AI output when that provider is unavailable.
- Tutor responses are not persisted and live-provider behavior is unverified without an API key.
- Automated unit, integration, and end-to-end suites are not yet configured.
- A production follow-up should add durable persistence, RLS-backed user data, broader algorithm-specific tests, and CI.
