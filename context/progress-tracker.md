# Progress Tracker

Update this file whenever a feature is completed or the active feature changes.

---

## Current Phase

Dev 2 frontend wiring — **complete**. Waiting on Dev 1 backend/API routes.

---

## Active Feature

**Dev 1:** Feature 02+ — Sudbury data, agent, API routes  
**Dev 2:** Idle — all six frontend features shipped on mock API

---

## Completed

### Dev 2 (frontend)

- Feature 01: API Abstraction Layer — `api.ts`, `api-mock.ts`, `api-real.ts`
- Feature 02: Store Expansion — `minesource-store.tsx`
- Feature 03: Wire Diagnosis Screen — `diagnosis.tsx`
- Feature 04: Wire Parts Screen — `parts.tsx`
- Feature 05: Leaflet Map Component — `SupplierMap.tsx`
- Feature 06: Wire Suppliers Screen — `suppliers.tsx` + geolocation + `SupplierMap`

### Dev 2 polish (included in Feature 06)

- `resetAll()` on wizard **Done** and **Leave** confirmation
- `SUDBURY_CENTER` exported from `api.ts`

---

## In Progress

- Dev 1 / Feature 01: Shared Types — review `src/lib/types.ts` (added by Dev 2 as compile prerequisite)
- Dev 1 / Feature 02: Sudbury Suppliers Data — `src/data/sudbury_suppliers.json`

---

## Next Up

- Dev 1: Features 03–12 (data files, agent, API routes)
- Dev 2: Switch `api.ts` one-liner to `api-real.ts` once Dev 1 routes are live
- Both: End-to-end test of full wizard on real API

---

## Open Questions

- None yet.

---

## Architecture Decisions

- TanStack Start chosen over Next.js to avoid framework migration cost during hackathon — existing frontend preserved
- `generateText` (not `streamText`) for demo reliability — simpler to test, no partial-response UI complexity
- Flat JSON files for knowledge retrieval — no runtime vector DB, faster setup, easier fallback
- `safetyCritical` flag set by the API route before agent call — guarantees safety banner regardless of LLM output
- Single orchestrator agent with two registered tools — spec said one agent, no multi-agent architecture
- Store uses `partsResult` / `setPartsResult` (not `parts`) to avoid conflict with legacy checklist state until fully removed
