Expand the MineSource store to hold diagnosis, parts, and supplier state.

### New State Fields

Add to `MineSourceState` in `src/lib/minesource-store.tsx`:

- `diagnosis` — `DiagnosisResult | null`, starts null
- `parts` — `PartsResult | null`, starts null
- `suppliers` — `Supplier[] | null`, starts null
- `screenStatus` — an object keyed by screen name (`diagnosis`, `parts`, `suppliers`) where each value is `"idle" | "loading" | "error"`

All types are imported from `src/lib/types.ts`.

### New Actions

Add setter functions to the context:

- `setDiagnosis(result: DiagnosisResult)` — stores the diagnosis result and sets its screen status to `"idle"`
- `setParts(result: PartsResult)` — stores the parts result and sets its screen status to `"idle"`
- `setSuppliers(suppliers: Supplier[])` — stores the suppliers list and sets its screen status to `"idle"`
- `setScreenStatus(screen: string, status: "idle" | "loading" | "error")` — updates a single screen's status

### Existing State

Do not remove or rename any existing fields or actions. The report state (`reportData`, `setReportData`) and wizard step logic must continue to work as before.

### Scope

Only `src/lib/minesource-store.tsx` is modified. No screen files are touched in this feature.

### Check When Done

- All four new state fields are in `MineSourceState`
- All four new action functions are in the context
- Existing store state and actions are unchanged
- TypeScript compiles without errors
- `useMineSource()` returns the new fields with correct initial values
