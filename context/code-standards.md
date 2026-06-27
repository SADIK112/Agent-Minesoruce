# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.

## TypeScript

- Strict mode throughout.
- No `any`. Use explicit interfaces or narrowly scoped types.
- Import all shared types from `src/lib/types.ts` — never redefine shapes locally.
- Validate unknown external input at system boundaries (API route handlers) before trusting it.

## TanStack Start

- API routes use `createAPIFileRoute` under `src/routes/api/`.
- Screen components use `createFileRoute` under `src/routes/`.
- Do not use `createServerFn` — use API file routes for all server logic.
- The route tree (`src/routeTree.gen.ts`) is auto-generated — never edit it manually.

## Components

- `src/components/ui/` — shadcn primitives. Do not modify after installation.
- `src/components/minesource/` — app-specific components. All custom UI goes here.
- No business logic in components — components fetch data, render state, and call handlers. Logic lives in `src/lib/`.

## API Routes

- Validate input with Zod before any logic runs. Return 400 on validation failure.
- Run the safety keyword check before calling the agent in the diagnose route.
- Every route must have a fallback — never return an empty response or an unhandled error.
- Return consistent JSON shapes defined by the types in `src/lib/types.ts`.

## Data Files

- JSON files in `src/data/` are read at request time on the server only.
- Never import data files in screen components or client-side code.
- Part categories are descriptive strings — never write OEM part numbers, SKUs, or prices.

## Frontend Data Fetching

- All API calls go through `src/lib/api.ts`. No screen component calls `fetch` directly.
- On error, retry up to two times. After two failures, use the demo fallback silently.
- Always show a loading skeleton while a fetch is pending.
- Always show an error state with a retry button on failure.

## Safety Rules (never break these)

- `safetyCritical: true` shows a red stop-work banner that cannot be dismissed.
- No price is shown anywhere in the UI.
- No OEM part number or SKU is shown anywhere in the UI.
- The parts screen always shows the disclaimer: "Suggested categories — confirm part numbers with your supplier."
- The landing footer always shows the decision-support disclaimer.

## Naming

- Files: kebab-case (`find-local-suppliers.ts`)
- Components: PascalCase (`SupplierMap.tsx`)
- Hooks: camelCase with `use` prefix (`useMineSource`)
- API route files: kebab-case matching the route path (`diagnose.ts` for `/api/diagnose`)

## Do Not Build

These are out of scope. Do not implement them:
- User auth or accounts
- Database server (Postgres, Supabase, etc.)
- Real-time vector DB
- Streaming AI responses (`generateText` only, not `streamText`)
- Equipment types beyond LHD
- Subsystems beyond hydraulics
