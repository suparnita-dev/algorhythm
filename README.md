# AlgoRhythm

AlgoRhythm is an interactive data-structures and algorithms learning workspace with visual execution, progress tracking, quizzes, and an AI tutor.

## Getting Started

## Local Setup

Install dependencies and copy the environment template:

```bash
npm install
copy .env.example .env.local
```

Create a Supabase project, then run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. Add the project URL and anon key to `.env.local`. Add an OpenAI key to enable live tutor responses; without it, the local tutor fallback remains available.

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Routes

- `POST /api/auth/signup` creates a Supabase user and profile.
- `POST /api/auth/signin` starts a Supabase session.
- `POST /api/auth/signout` ends the session.
- `GET /api/auth/me` returns the current user.
- `POST /api/tutor` sends a protected tutor request to OpenAI or the local fallback.

Never commit `.env.local`, Supabase service-role keys, or OpenAI keys.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
