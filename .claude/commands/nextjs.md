---
name: nextjs
description: Next.js 14+ App Router reference — CLI commands, file conventions, route handlers, and project structure
---

# Next.js 14+ App Router

## CLI Commands

```bash
npx create-next-app@latest <name> --typescript --tailwind --eslint --app --no-src-dir
npm run dev          # next dev (Turbopack by default)
npm run build        # next build
npm run start        # next start (production)
npm run lint         # next lint
```

## App Router File Conventions

Every special file lives alongside its route segment folder:

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI — makes segment publicly accessible |
| `layout.tsx` | Shared UI that persists across navigations (no re-render) |
| `loading.tsx` | Instant loading skeleton (Suspense boundary) |
| `error.tsx` | Error boundary — must be `"use client"` |
| `not-found.tsx` | 404 UI |
| `route.ts` | API Route Handler (replaces `pages/api/`) |
| `template.tsx` | Like layout but re-mounts on navigation |
| `middleware.ts` | Runs before request (project root, not in `app/`) |

## Route Handlers (`route.ts`)

```ts
// app/api/diagnose/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ result: "ok" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return NextResponse.json({ id });
}
```

- Handlers live at `app/api/<path>/route.ts`
- Export named functions: `GET POST PUT PATCH DELETE HEAD OPTIONS`
- Use `NextRequest` / `NextResponse` (Web standard APIs)
- No Express-style `req/res` — use `req.json()`, `req.formData()`, etc.

## Dynamic Routes

```
app/
  items/
    [id]/
      page.tsx        → /items/123
    [...slug]/
      page.tsx        → /items/a/b/c
    (group)/          → URL grouping, no segment in URL
      dashboard/
        page.tsx      → /dashboard
```

## Server vs Client Components

```tsx
// Server Component (default — no directive needed)
async function ServerPage() {
  const data = await fetch("...");   // direct async/await
  return <div>{data}</div>;
}

// Client Component
"use client";
import { useState } from "react";
function ClientWidget() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Environment Variables

```bash
# .env.local (never committed)
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_MAP_LAT=46.4917    # NEXT_PUBLIC_ prefix → exposed to browser
```

Access server-only: `process.env.OPENAI_API_KEY`
Access in browser: `process.env.NEXT_PUBLIC_MAP_LAT`

## Project Structure (Agent MineSource target layout)

```
app/
  page.tsx                  → /  (landing)
  report/page.tsx           → /report
  diagnosis/page.tsx        → /diagnosis
  parts/page.tsx            → /parts
  suppliers/page.tsx        → /suppliers
  api/
    agent/
      diagnose/route.ts     → POST /api/agent/diagnose
      parts/route.ts        → POST /api/agent/parts
    suppliers/route.ts      → GET  /api/suppliers
  layout.tsx                (root layout + providers)
agent/
  orchestrator.ts
  tools/
    search-failure-knowledge.ts
    get-parts-for-fault.ts
    find-local-suppliers.ts
  schemas/
    diagnosis.ts
    parts.ts
lib/
  types.ts
  haversine.ts
  demo-fallback.ts
  session.ts
data/
  sudbury_suppliers.json
  failure_to_parts.json
  knowledge-chunks.json
```

## Key Packages for Agent MineSource

```bash
npm install ai @ai-sdk/openai zod
npm install leaflet react-leaflet
npm install @types/leaflet --save-dev
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge alert checkbox separator
```

## Vercel AI SDK Tool Calling Pattern

```ts
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const result = await streamText({
  model: openai("gpt-4o-mini"),
  system: "You are a mining maintenance agent...",
  prompt: symptom,
  tools: {
    search_failure_knowledge: tool({
      description: "Search the knowledge base for matching failure patterns",
      parameters: z.object({ symptom: z.string(), subsystem: z.string() }),
      execute: async ({ symptom, subsystem }) => searchFailureKnowledge(symptom, subsystem),
    }),
  },
});
```
