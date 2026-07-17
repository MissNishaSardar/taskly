# taskly

A task management application built with Next.js 16, React 19, Prisma 7 (SQLite), and Better Auth.

## Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack, typed routes)
- **UI:** React 19.2, Tailwind CSS v4, shadcn/ui on Base UI
- **Database:** Prisma 7 + libSQL (SQLite, file-backed)
- **Auth:** Better Auth with email/password authentication
- **Packages:** bun, Zod 4, next-themes, react-toastify, lucide-react

## Getting started

```bash
bun install
cp .env.example .env    # then fill in secrets
bun migrate             # create SQLite DB + migrations
bun dev                 # start dev server
```

## Commands

| Command         | Description                    |
| --------------- | ------------------------------ |
| `bun dev`       | Start dev server (Turbopack)   |
| `bun build`     | Generate Prisma client + build |
| `bun lint`      | Run ESLint                     |
| `bun typecheck` | TypeScript type checking       |
| `bun prod`      | Full build + production start  |
| `bun migrate`   | Create Prisma migrations       |
| `bun studio`    | Open Prisma Studio             |
