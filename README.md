# MSCS Weekend · Fall 26 — Class Portal

A simple class portal for Air University's MSCS Weekend program (Fall 2026, Semester 1),
replacing WhatsApp groups + Google Drive with one place for course content, slides,
assignments, quizzes, and tasks.

- **You (the CR)** are the super admin: create subjects, upload slides/material, and
  post assignments/quizzes/tasks with due dates.
- **Classmates** log in with their roll number, see everything in one dashboard, and
  can tick off their own tasks as complete. Course content has no complete/incomplete
  toggle — it's just there to read.
- Tasks are always sorted with the soonest due date first, completed ones sink to
  the bottom.
- Mobile-friendly, no accounts to hand out — everyone claims their own roster row.

Built with Next.js (App Router) + Prisma + Postgres + NextAuth, made to run entirely
on Vercel's free tier.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | A free Postgres database — see step 2 |
| `AUTH_SECRET` | Run `npx auth secret` and paste the value it prints |
| `BLOB_READ_WRITE_TOKEN` | A Vercel Blob store — see step 3 (only needed once you want file uploads to work; the rest of the app runs fine without it) |
| `ADMIN_NAME` / `ADMIN_ROLL_NUMBER` | Your own name + roll number, used once by the seed script |

Push the schema and seed your own admin account:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000, enter the `ADMIN_ROLL_NUMBER` you set, and create your
password — you're now logged in as the CR/super admin.

## 2. Database (free)

Easiest path: **Vercel Postgres** (actually Neon under the hood) —
Vercel dashboard → your project → **Storage** → **Create Database** → **Postgres**
→ connect it to this project. Vercel injects `DATABASE_URL` automatically; no copy-pasting.

Alternative: create a free database directly at [neon.com](https://neon.com) or
[supabase.com](https://supabase.com) and paste its connection string as `DATABASE_URL`.
Any of these work — it's just Postgres.

## 3. File storage (free)

For uploading slides/PDFs: Vercel dashboard → your project → **Storage** →
**Create Database** → **Blob**. Once connected, `BLOB_READ_WRITE_TOKEN` is injected
automatically, same as the database. Free tier covers class-sized usage comfortably.

If you'd rather not deal with file uploads at all, every "upload a file" field also
accepts a pasted link (Google Drive, OneDrive, YouTube, etc.) — either works.

## 4. Deploy to Vercel

```bash
git init            # if not already
git add -A
git commit -m "Initial commit"
gh repo create mscs-fall26-portal --private --source=. --push
```

Then in Vercel: **Add New Project** → import the GitHub repo → attach the Postgres
and Blob stores from steps 2–3 → set `AUTH_SECRET` and `ADMIN_NAME`/`ADMIN_ROLL_NUMBER`
as environment variables → Deploy.

After the first deploy, run the seed once against the production database so your
own admin row exists:

```bash
# with DATABASE_URL pointed at the production database (Vercel CLI: `vercel env pull`)
npm run db:seed
```

Then visit your `*.vercel.app` URL, log in with your roll number, and you're the CR.
Everything after that — subjects, roster, uploads — is managed from the Admin screen,
no redeploys needed.

## How it works day to day

1. **Admin → Manage roster**: add each classmate's name + roll number once. They
   log in themselves and set their own password the first time — you never handle
   passwords.
2. **Admin → a subject**: upload slides/material under "Course content" (view-only,
   no complete toggle), and post assignments/quizzes/tasks under the amber section
   (these get a due date and show up on every student's dashboard, soonest first).
3. **Students**: log in, see their to-dos on top sorted by due date, tick them off,
   and browse course content below, grouped by subject.

## Notes on the current design

- **Security model**: this is built for a trusted, closed class of ~24–26 people,
  not the public internet. A roll number is enough to claim an account (with a
  password the student sets themselves) — good enough for this use case, but don't
  reuse this pattern for anything with real stakes.
- **Prisma migrations**: this project uses `prisma db push` (schema sync) rather
  than versioned migrations, to keep things simple for a one-person-maintained class
  tool. If the project grows, switch to `prisma migrate dev`/`deploy`.
