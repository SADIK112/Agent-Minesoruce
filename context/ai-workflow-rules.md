# AI Workflow Rules

These rules govern how AI assistants and both developers work on this project. Read this file at the start of every session.

## Core Principle

Work on one feature at a time. Every feature has a spec. Do not implement anything not covered by the current feature spec. Do not infer behavior — read the spec.

## Before Starting Any Feature

1. Read `context/project-overview.md`
2. Read `context/architecture-context.md`
3. Read the feature spec being implemented
4. Check `context/progress-tracker.md` to confirm the feature's dependencies are complete

## Scope Discipline

- If a change touches more than one screen, more than one API route, or more than one data layer concept — split it.
- "If a change cannot be verified end to end quickly, the scope is too broad."
- Do not implement the next feature while implementing the current one.
- Do not refactor unrelated code while implementing a feature.

## File Ownership

Dev 1 and Dev 2 each have explicit file ownership per the architecture context. Never edit a file owned by the other developer without flagging it first. This is the primary mechanism for avoiding merge conflicts.

Dev 1 owns: `src/data/`, `src/lib/types.ts`, `src/lib/schemas.ts`, `src/lib/haversine.ts`, `src/lib/demo-fallback.ts`, `src/lib/agent.ts`, `src/lib/tools/`, `src/routes/api/`, `scripts/`

Dev 2 owns: `src/lib/minesource-store.tsx`, `src/lib/api.ts`, `src/lib/api-mock.ts`, `src/lib/api-real.ts`, `src/routes/diagnosis.tsx`, `src/routes/parts.tsx`, `src/routes/suppliers.tsx`, `src/components/minesource/SupplierMap.tsx`

Shared (read by both, modified only by Dev 1): `src/lib/types.ts`

## Foundation File Protection

Do not modify `src/components/ui/` after initial shadcn installation. Do not modify `src/routeTree.gen.ts` manually. Do not modify `src/lib/types.ts` without both developers agreeing.

## Completing a Feature

Before marking a feature done:
- The feature works end to end within its defined scope
- TypeScript compiles without errors
- No architecture invariant was violated (no prices, no SKUs, correct file ownership)
- `context/progress-tracker.md` is updated with what was completed

## Context File Maintenance

Context files reflect actual implementation, not aspirations. When an architectural decision changes, update `context/architecture-context.md`. When code conventions change, update `context/code-standards.md`. The progress tracker is updated after every completed feature.

## Demo Reliability First

This is a hackathon. Demo reliability is the top priority. Every API call must have a working fallback. The demo must work on bad Wi-Fi. A silent fallback is better than a visible error during a presentation.
