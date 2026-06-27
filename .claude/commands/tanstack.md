---
name: tanstack
description: TanStack Start + TanStack Router reference — CLI commands, file-based routing, server functions, API routes, and route tree generation
---

# TanStack Start + TanStack Router

## CLI Commands

```bash
# Dev server (runs tsr watch + vite dev in parallel)
npm run dev          # or: bun run dev

# Production build (runs tsr generate then vite build)
npm run build

# Preview production build
npm run preview

# Route tree generation (one-shot)
npx tsr generate

# Route tree watch (continuous, used in dev)
npx tsr watch

# Lint / format
npm run lint
npm run format
```

## File-Based Routing Conventions

Routes live in `src/routes/`. The Router CLI scans this directory and auto-generates `src/routeTree.gen.ts`.

| File | Route |
|------|-------|
| `src/routes/__root.tsx` | App shell — wraps every route |
| `src/routes/index.tsx` | `/` |
| `src/routes/report.tsx` | `/report` |
| `src/routes/diagnosis.tsx` | `/diagnosis` |
| `src/routes/about.tsx` | `/about` |
| `src/routes/items/$id.tsx` | `/items/:id` (dynamic) |
| `src/routes/items_/$id/edit.tsx` | `/items/:id/edit` (flat, avoids nesting) |
| `src/routes/_layout.tsx` | Pathless layout — wraps children without URL segment |
| `src/routes/api/health.ts` | Server route: `GET /api/health` |

Files prefixed with `-` are ignored by the router CLI.

## Route Definition Pattern

```tsx
// src/routes/report.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/report")({
  // Optional: loader runs before component
  loader: async () => {
    return fetch("/api/data").then(r => r.json());
  },
  component: ReportPage,
});

function ReportPage() {
  const data = Route.useLoaderData();
  return <div>{data}</div>;
}
```

## Root Route (`__root.tsx`)

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <html>
      <body>
        <Outlet />   {/* renders child routes */}
      </body>
    </html>
  ),
});
```

## Navigation

```tsx
import { Link, useNavigate, useRouter } from "@tanstack/react-router";

// Declarative
<Link to="/report">Report an issue</Link>
<Link to="/items/$id" params={{ id: "123" }}>Item</Link>

// Programmatic
const router = useRouter();
router.navigate({ to: "/diagnosis" });

// With search params
router.navigate({ to: "/suppliers", search: { lat: 46.49, lng: -80.99 } });
```

## Server Functions (createServerFn)

```ts
// src/lib/diagnose.ts — runs ONLY on server
import { createServerFn } from "@tanstack/react-start";

export const diagnose = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { symptom: string })
  .handler(async ({ data }) => {
    // safe to use OPENAI_API_KEY here
    const result = await callAgent(data.symptom);
    return result;
  });

// Usage in component (can be called from client or server)
const result = await diagnose({ data: { symptom: "hose burst" } });
```

## Server Routes (API endpoints)

```ts
// src/routes/api/suppliers.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const Route = createAPIFileRoute("/api/suppliers")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const categories = url.searchParams.get("categories")?.split(",") ?? [];
    const suppliers = await findSuppliers(categories);
    return Response.json(suppliers);
  },
  POST: async ({ request }) => {
    const body = await request.json();
    return Response.json({ ok: true });
  },
});
```

## Route Context & State Sharing

```tsx
// Pass context from root to all routes
export const Route = createRootRoute({
  context: () => ({ store: createStore() }),
});

// Access in child
const { store } = Route.useRouteContext();
```

## vite.config.ts Structure

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tsconfigPaths(),
  ],
});
```

## Current Project Layout (Agent MineSource)

```
src/
  routes/
    __root.tsx          App shell (html/head/body)
    index.tsx           / → Landing
    report.tsx          /report → Step 1
    diagnosis.tsx       /diagnosis → Step 2
    parts.tsx           /parts → Step 3
    suppliers.tsx       /suppliers → Step 4
  components/
    minesource/
      AppShell.tsx      Header, Stepper, Modal, Footer
    ui/                 shadcn primitives
  lib/
    minesource-store.tsx  Wizard state (React Context)
    utils.ts
  styles.css            Tailwind v4 design tokens
```

## Key Config Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite + TanStack Start plugin config |
| `src/routeTree.gen.ts` | Auto-generated — DO NOT edit manually |
| `src/router.tsx` | Router instantiation |
| `src/start.ts` | Entry point for SSR |
| `bunfig.toml` | Bun runtime config |
| `components.json` | shadcn/ui config |

## Adding a New Route

1. Create `src/routes/<name>.tsx`
2. Export `Route = createFileRoute("/<name>")({ component: ... })`
3. The route tree regenerates automatically in dev (`tsr watch`)
4. Import `Link` from `@tanstack/react-router` to link to it
