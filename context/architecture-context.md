# Architecture Context

## Stack

| Layer | Technology | Role |
|---|---|---|
| Framework | TanStack Start (React 19, Vite 7) | Full-stack app, file-based routing, SSR |
| UI | Tailwind CSS v4 + shadcn/ui | Styling and component primitives |
| Routing | TanStack Router | File-based, auto-generates routeTree.gen.ts |
| State | React Context (minesource-store.tsx) | Wizard state across screens |
| AI Agent | Vercel AI SDK + gpt-4o-mini | Diagnosis orchestrator with tool calling |
| Knowledge | Flat JSON file | Pre-built chunk index, no live vector DB |
| Map | Leaflet + react-leaflet + OpenStreetMap | Supplier map on suppliers screen |
| Validation | Zod | All API input and agent output |
| Runtime | Bun | Local dev and package management |
| Deploy | Vercel | Production hosting |

## System Boundaries

- `src/routes/api/` — API route handlers. Input validation, safety checks, tool calls, response. No long-running work — agent calls are bounded by a 15-second timeout with a demo fallback.
- `src/lib/tools/` — Pure functions. No LLM calls. Testable in isolation.
- `src/lib/agent.ts` — Orchestrator. Calls Vercel AI SDK, registers tools, parses and validates output.
- `src/lib/` — Shared utilities: types, schemas, haversine, demo fallback, API abstraction.
- `src/routes/` — Screen components. Fetch data through `src/lib/api.ts` only — never call `fetch` directly.
- `src/data/` — Static JSON files. Read at request time on the server. Never shipped to the browser.
- `src/components/minesource/` — App-specific UI components.
- `src/components/ui/` — shadcn primitives. Do not modify after installation.

## API Endpoints

| Method | Path | Owner | Purpose |
|---|---|---|---|
| POST | /api/diagnose | Dev 1 | Runs AI agent, returns diagnosis |
| POST | /api/parts | Dev 1 | Returns parts list for a fault key |
| GET | /api/suppliers | Dev 1 | Returns ranked supplier list |

## Data Files (server-only, never sent to browser)

| File | Contents |
|---|---|
| `src/data/sudbury_suppliers.json` | 8–10 real Sudbury businesses with coordinates |
| `src/data/failure_to_parts.json` | 10 LHD fault keys mapped to part categories |
| `src/data/knowledge-chunks.json` | 100+ text chunks for agent knowledge retrieval |

## Agent Architecture

One orchestrator agent. Two registered tools (knowledge search, no LLM). Supplier lookup is pure code — no agent involved.

```
POST /api/diagnose
  → safety keyword check (before LLM)
  → runDiagnosisAgent()
      → LLM calls search_failure_knowledge tool
      → LLM returns structured JSON
      → Zod validates output
      → on any failure → DEMO_FALLBACK
  → return DiagnosisResult

POST /api/parts
  → getPartsForFault(faultKey)   ← pure function, no LLM
  → return PartsResult

GET /api/suppliers
  → findLocalSuppliers(categories, lat, lng)   ← pure function, no LLM
  → return Supplier[]
```

## Frontend Data Flow

```
Screen component
  → imports from src/lib/api.ts (wrapper only)
  → api.ts re-exports from api-mock.ts (day 1) or api-real.ts (day 2)
  → stores result in minesource-store context
  → renders from context
```

Switching from mock to real requires changing one line in `src/lib/api.ts`.

## Safety Invariants

1. `safetyCritical` is set by the API route before calling the agent — not determined solely by the LLM output. A bad LLM response cannot suppress a safety banner.
2. The red stop-work banner is never dismissable when `safetyCritical` is true.
3. No price is ever shown in the UI.
4. No OEM part number or SKU is ever shown in the UI.
5. Part categories in `failure_to_parts.json` are descriptive strings only.

## Key Files (existing)

| File | Purpose |
|---|---|
| `src/routes/__root.tsx` | App shell, wraps everything in MineSourceProvider |
| `src/lib/minesource-store.tsx` | React Context for wizard state |
| `src/components/minesource/AppShell.tsx` | Header, stepper, footer, modal |
| `src/routes/index.tsx` | Landing screen |
| `src/routes/report.tsx` | Report screen (already built) |
| `src/routes/diagnosis.tsx` | Diagnosis screen (currently mock) |
| `src/routes/parts.tsx` | Parts screen (currently mock) |
| `src/routes/suppliers.tsx` | Suppliers screen (currently SVG map + mock data) |
