# Progress Tracker

Update this file whenever a feature is completed or the active feature changes.

---

## Current Phase

Feature 01 — in progress

---

## Active Feature

**Dev 1:** Feature 01 — Shared Types  
**Dev 2:** Waiting on Dev 1 Feature 01 before starting Feature 01

---

## Completed

_Nothing completed yet._

---

## In Progress

- Dev 1 / Feature 01: Shared Types — create `src/lib/types.ts` with all six shared interfaces
- Dev 2 / Feature 01: Blocked until Dev 1 Feature 01 is committed

---

## Next Up

- Dev 1 / Feature 02: Sudbury Suppliers Data
- Dev 2 / Feature 01: API Abstraction Layer (starts after Dev 1 Feature 01 is committed)

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
