# Progress Tracker

Update this file whenever a feature is completed or the active feature changes.

---

## Current Phase

All features complete — Phase 2 (frontend integration) done

---

## Active Feature

None — full integration complete

---

## Completed

- Dev 1 / Feature 01: Shared Types — `src/lib/types.ts`
- Dev 1 / Feature 02: Sudbury Suppliers Data — `src/data/sudbury_suppliers.json`
- Dev 1 / Feature 03: Failure to Parts Data — `src/data/failure_to_parts.json`
- Dev 1 / Feature 04: Knowledge Chunks Build Script — `scripts/raw-knowledge.md`, `scripts/build-knowledge-chunks.ts`, `src/data/knowledge-chunks.json` (32 chunks)
- Dev 1 / Feature 05: Zod Schemas and Utilities — `src/lib/schemas.ts`, `src/lib/haversine.ts`, `src/lib/demo-fallback.ts`
- Dev 1 / Feature 06: Tool search-failure-knowledge — `src/lib/tools/search-failure-knowledge.ts`
- Dev 1 / Feature 07: Tool get-parts-for-fault — `src/lib/tools/get-parts-for-fault.ts`
- Dev 1 / Feature 08: Tool find-local-suppliers — `src/lib/tools/find-local-suppliers.ts` (normalises nested JSON, keyword matching, distance sort)
- Dev 1 / Feature 09: AI Agent Orchestrator — `src/lib/agent.ts` (AI SDK v7: `inputSchema` not `parameters`, `stopWhen: isLoopFinished()`)
- Dev 1 / Feature 10: API Route /api/diagnose — `src/routes/api/diagnose.ts`
- Dev 1 / Feature 11: API Route /api/parts — `src/routes/api/parts.ts`
- Dev 1 / Feature 12: API Route /api/suppliers — `src/routes/api/suppliers.ts`
- Dev 2 / Feature 01: API Abstraction Layer — `src/lib/api-mock.ts`, `api-real.ts`, `api.ts`
- Dev 2 / Feature 02: Store Expansion — `minesource-store.tsx` (diagnosis, partsResult, suppliers, screenStatus)
- Dev 2 / Feature 03: Wire Diagnosis Screen — `src/routes/diagnosis.tsx`
- Dev 2 / Feature 04: Wire Parts Screen — `src/routes/parts.tsx`
- Dev 2 / Feature 05: Leaflet Map Component — `src/components/minesource/SupplierMap.tsx`
- Dev 2 / Feature 06: Wire Suppliers Screen — `src/routes/suppliers.tsx`

---

## In Progress

None.

---

## Next Up

Switch `src/lib/api.ts` one-line import from `api-mock` → `api-real` to go live with OpenAI.

---

## Data Sources

- `src/data/hf_hydraulic_brake_failures.json` — 543 real hydraulic+brake failure records from HuggingFace `electricsheepafrica/africa-synth-mining-equipment-failure-all` (5,000 row dataset, retrieved 2026-06-27). Used to ground failure_to_parts.json in real failure statistics.

---

## Open Questions

- None yet.

---

## Architecture Decisions

- TanStack Start chosen over Next.js to avoid framework migration cost during hackathon — existing frontend preserved
- API routes use `createFileRoute` with `server.handlers` (not `createAPIFileRoute` — that subpath doesn't exist in the installed version `@tanstack/react-start@1.168.26`)
- AI SDK v7: tool definitions use `inputSchema` (not `parameters`); loop control uses `stopWhen: isLoopFinished()` (not `maxSteps`)
- `generateText` (not `streamText`) for demo reliability — simpler to test, no partial-response UI complexity
- Flat JSON files for knowledge retrieval — no runtime vector DB, faster setup, easier fallback
- `safetyCritical` flag set by the API route before agent call — guarantees safety banner regardless of LLM output
- Single orchestrator agent with two registered tools — spec said one agent, no multi-agent architecture
