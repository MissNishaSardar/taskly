<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16.2 + React 19.2 (App Router, Turbopack, React Compiler on, `typedRoutes` on)
- Prisma 7 + `@prisma/adapter-libsql` (SQLite, file-backed)
- Tailwind CSS v4 via `@tailwindcss/postcss`; config in `globals.css` (`@theme`), no `tailwind.config.ts`
- shadcn/ui (`base-luma` style) on `@base-ui/react` — not Radix. Add components via `bunx shadcn add`
- `better-auth` (email/password) — server config at `src/lib/auth.ts`, client at `src/lib/auth-client.ts`
- next-themes (`defaultTheme: "dark"`, `enableSystem: false`), `react-toastify`, `lucide-react`
- `@t3-oss/env-nextjs` + Zod 4 for env validation
- Fonts: `Noto_Sans` (`--font-heading`), `Nunito_Sans` (`--font-sans`) in `src/lib/fonts.ts`

## Commands

| Command         | What it does                                               |
| --------------- | ---------------------------------------------------------- |
| `bun dev`       | next dev (Turbopack)                                       |
| `bun build`     | `prisma generate && next build`                            |
| `bun lint`      | eslint (`eslint-config-next` core-web-vitals + typescript) |
| `bun typecheck` | `next typegen && tsc --noEmit` (run before commit)         |
| `bun prod`      | full build + start (schema/env changes)                    |
| `bun migrate`   | `prisma migrate dev && prisma generate` (schema edits)     |
| `bun studio`    | Prisma Studio (headless, `--browser none`)                 |

## Env validation

- `src/lib/env/serverEnv.ts` / `clientEnv.ts` — schemas via `@t3-oss/env-nextjs`
- `serverEnv.ts` uses `experimental__runtimeEnv: process.env` (keep it verbatim)
- `next.config.ts` imports both as side effects at top of module
- New vars: add to `serverEnv.ts` (server) or `clientEnv.ts` (`NEXT_PUBLIC_*`), mirror in `.env.example`

## Path aliases

| Alias          | Maps to                              |
| -------------- | ------------------------------------ |
| `@/*`          | `./src/*`                            |
| `@generated/*` | `./generated/*` (Prisma client only) |

## Prisma

- Generator: `provider = "prisma-client"`, `output = "../generated/prisma"` (Prisma 7, **not** `prisma-client-js`)
- Import: `import { PrismaClient } from "@generated/prisma/client"` — no `@prisma/client` surface
- `prisma/schema.prisma` has **no** `datasource.url` — comes from `prisma.config.ts` via `env("DATABASE_URL")`
- `src/lib/database/dbClient.ts` is a `globalThis` singleton wired to `PrismaLibSql` — import from there, don't instantiate elsewhere
- `serverEnv.DATABASE_URL` validated to start with `file:./`
- Schema edits: `bun migrate` (creates migrations). Migrations exist at `prisma/migrations/`.
- `generated` is gitignored; don't hand-edit. `build`/`prod` scripts prepend `prisma generate`.

## shadcn / Base UI

- `components.json`: `ui` → `@/components/shadcnui`. `bunx shadcn add` places files there.
- Installed components: `alert-dialog`, `avatar`, `breadcrumb`, `button`, `calendar`, `card`, `checkbox`, `collapsible`, `dropdown-menu`, `field`, `input`, `label`, `popover`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `tooltip`
- Primitives from `@base-ui/react`, not Radix or react-aria.

## Authentication (Better Auth)

- API route: `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth.handler)` (GET + POST)
- Server: `src/lib/auth.ts` — `betterAuth()` with `prismaAdapter` + `emailAndPassword: { enabled: true }`. Reads `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` from env.
- Client: `src/lib/auth-client.ts` — `createAuthClient()` from `better-auth/react`
- `better-auth` session cookie uses `rememberMe` flag for persistent vs session-only `maxAge`
- `UserNav` (`src/components/UserNav.tsx`) — client component using `authClient.useSession()`. Avatar with initials dropdown containing user name/email and sign out. Rendered in the private layout header.

## Public pages (route group `(public)`)

| Route        | Component             | File                                                                   |
| ------------ | --------------------- | ---------------------------------------------------------------------- |
| `/`          | Sign-in (Card layout) | `src/app/(public)/page.tsx` + `src/components/SignInForm.tsx`          |
| `/register`  | Sign-up (Card layout) | `src/app/(public)/register/page.tsx` + `src/components/SignUpForm.tsx` |
| `/dashboard` | Mock dashboard        | `src/app/(private)/dashboard/page.tsx`                                 |
| `/dashboard` | Mock dashboard header | `src/components/UserNav.tsx` — in `(private)/layout.tsx`, right side   |

## Form patterns

Schemas in `src/lib/zodSchema.ts` — export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, shadcn primitives, `Controller`, and `zod` for validation:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field goes through `Controller` with `Field`, `FieldLabel`, `FieldError`, `Input`. Submit via `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

See existing examples: `src/components/SignInForm.tsx`, `src/components/SignUpForm.tsx`.

## Code conventions

- **Component style:** arrow functions (`const Foo = () => { ... }`) with PascalCase names. Exception: `src/components/shadcnui/` uses `function` keyword (shadcn convention, keep as-generated).
- **File names:** PascalCase for component files (e.g. `SignInForm.tsx`), kebab-case for utilities.

## Styling conventions

- Prettier: `singleAttributePerLine: true`, `bracketSameLine: true`, `experimentalTernaries: true`, `prettier-plugin-tailwindcss`
- Tailwind v4: all config in `globals.css`. No `tailwind.config.ts`.
- `globals.css` imports `shadcn/tailwind.css` — removing it breaks Base Luma design tokens.

## Misc

- Package manager: `bun`. `bun.lock` committed.
- ESLint ignores: `.next`, `out`, `build`, `next-env.d.ts`, `generated`.
- `.env` gitignored; `.env.example` is the template. Do not commit secrets.
- Git: use PowerShell here-strings for commit messages.
- No CI or pre-commit hooks. Pre-PR check: `bun lint && bun typecheck`.
