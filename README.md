# NorthFix

**Maintenance copilot for underground mining equipment.**

NorthFix helps a maintenance worker report an underground LHD (Load-Haul-Dump) hydraulic problem, review a likely diagnosis, confirm a parts checklist, and find nearby Sudbury suppliers — all in a short, mobile-friendly wizard.

> NorthFix provides decision support only. It is not a substitute for certified inspection, OEM service procedures, or supervisor approval.

---

## Who it's for

A maintenance worker or shift supervisor at an underground mine near Sudbury, Ontario, working on hydraulic faults in LHDs. Often on a phone or tablet, sometimes with gloves on, sometimes underground with patchy signal. The UI is designed for that environment: large tap targets, plain language, minimal typing, no jargon-heavy forms.

## The flow

The product is a 4-step wizard with a persistent stepper:

1. **Report** — Describe what happened in plain language. Pick equipment, subsystem, symptom, severity (rough / stopped / unsafe), and location (underground / surface / shop). Selecting **unsafe** triggers a safety-critical confirmation modal before proceeding.
2. **Diagnose** — A simulated agent runs through diagnostic steps and surfaces a primary fault ("Hydraulic hose abrasion / fitting leak") with a confidence badge, plus alternative faults to consider.
3. **Parts** — A checklist of suggested part categories grouped into *primary* and *related* tiers. Items can be checked off and the list copied to clipboard to share with a supplier.
4. **Suppliers** — Sudbury-area suppliers sorted by best match and nearest distance, shown alongside a stylized interactive map. Each card has a `tel:` link for one-tap calling.

A landing page (`/`) introduces the tool and routes into **Report**.

## Mock-data scope

This is a frontend prototype. All diagnoses, parts lists, and suppliers are mock data. There is no backend, no auth, and no persistence beyond in-memory React Context (`src/lib/northfix-store.tsx`). Loading states and the "agent thinking" panel are simulated.

## Tech stack

- **TanStack Start** (React 19, Vite 7) with file-based routing in `src/routes/`
- **Tailwind CSS v4** with an industrial OKLCH design system in `src/styles.css` (deep slate navy + amber/copper accent + semantic safety colors)
- **shadcn/ui** primitives in `src/components/ui/`
- **React Context** for wizard state (`src/lib/northfix-store.tsx`)

## Project layout

```
src/
  routes/
    __root.tsx       App shell (html/head/body)
    index.tsx        Landing
    report.tsx       Step 1 — incident report
    diagnosis.tsx    Step 2 — agent diagnosis
    parts.tsx        Step 3 — parts checklist
    suppliers.tsx    Step 4 — Sudbury suppliers + map
  components/
    northfix/
      AppShell.tsx   Header, Stepper, Modal, Footer
    ui/              shadcn primitives
  lib/
    northfix-store.tsx   Wizard state (report + parts)
  styles.css         Design tokens + Tailwind v4 theme
```

## Running locally

The dev server runs automatically in the Lovable preview. Locally:

```bash
bun install
bun run dev
```

## Status

Frontend prototype with mock data. No backend, no auth, no persistence across reloads.
