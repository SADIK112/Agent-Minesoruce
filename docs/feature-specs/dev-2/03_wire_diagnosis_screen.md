Wire the diagnosis screen to the real API.

### API Call

`src/routes/diagnosis.tsx` calls `POST /api/diagnose` through `src/lib/api.ts` on mount, using the report data already in the MineSource store.

Call `setScreenStatus("diagnosis", "loading")` before the request. On success, call `setDiagnosis(result)`. On failure, retry once. If the second attempt also fails, call `setDiagnosis(DEMO_FALLBACK)` silently and continue — no error is shown to the user.

### Loading State

While `screenStatus.diagnosis === "loading"`, show a skeleton layout — three grey placeholder cards where the fault results will appear. No spinner. No text.

### Result Rendering

When `diagnosis` is set in the store:

**Safety banner** — if `diagnosis.safetyCritical` is true, render a red full-width banner at the top of the screen reading "STOP WORK — Safety-critical fault detected. Do not operate this equipment." This banner cannot be dismissed.

**Fault cards** — one card per entry in `diagnosis.faults`. Each card shows the fault description and a confidence percentage. No raw `key` field shown to the user.

**Summary** — render `diagnosis.summary` as a paragraph below the fault cards.

### Navigation

The "Continue to Parts" button is disabled while loading. It becomes active once `diagnosis` is set.

### Scope

Only `src/routes/diagnosis.tsx` and `src/lib/api.ts` are modified. The API abstraction layer (feature 01) must be in place before wiring this screen.

### Check When Done

- Screen calls the API on mount with report data from the store
- Loading skeleton appears immediately
- Safety banner renders and cannot be dismissed when `safetyCritical` is true
- Fault cards render with description and confidence
- Retry logic fires once before falling back to DEMO_FALLBACK
- "Continue to Parts" button is disabled during loading
