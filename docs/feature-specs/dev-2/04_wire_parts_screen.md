Wire the parts screen to the real API.

### API Call

`src/routes/parts.tsx` calls `POST /api/parts` through `src/lib/api.ts` on mount, using the `faultKey` from the first fault in `diagnosis.faults` stored in the MineSource store.

Call `setScreenStatus("parts", "loading")` before the request. On success, call `setParts(result)`. On failure, retry once. If the second attempt also fails, show the error state (not a silent fallback — parts are not safety-critical, an empty list is clearer than wrong parts).

### Loading State

While `screenStatus.parts === "loading"`, show a skeleton layout — two grouped placeholder blocks representing the primary and related parts sections.

### Result Rendering

When `parts` is set in the store:

**Primary parts** — render as a checklist with checkboxes. Each item shows the part category string. No prices. No OEM part numbers.

**Related parts** — render as a secondary list below the primary checklist.

**Disclaimer** — always visible regardless of load state: "Suggested categories — confirm part numbers with your supplier."

### Error State

If both API attempts fail, show: "Could not load parts list. Check your connection and try again." with a retry button. The retry button calls the API again and resets the loading state.

### Navigation

"Continue to Suppliers" button is disabled while loading and in error state. It becomes active once `parts` is set.

### Scope

Only `src/routes/parts.tsx` and `src/lib/api.ts` are modified. The diagnosis screen wiring (feature 03) must be in place so `faultKey` is available in the store.

### Check When Done

- Screen calls the API on mount with `faultKey` from the store
- Loading skeleton appears immediately
- Primary and related parts render as separate sections
- Parts disclaimer is always visible
- Error state shows with retry button on double failure
- "Continue to Suppliers" button is disabled during loading
