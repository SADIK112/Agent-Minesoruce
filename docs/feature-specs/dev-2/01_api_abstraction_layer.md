Build the API abstraction layer so the frontend can run on mock data before the real API exists.

### Three Files

**`src/lib/api-mock.ts`** — returns hardcoded responses matching the exact types from `src/lib/types.ts`. One exported async function per API endpoint:

- `diagnoseMock(input)` — returns a hardcoded `DiagnosisResult` for the hose-burst scenario
- `getPartsMock(faultKey)` — returns hardcoded `PartsResult` for `hose-burst`
- `getSuppliersMock(categories, lat, lng)` — returns 3 hardcoded `Supplier` objects with real Sudbury data

All mock functions resolve after a 500ms artificial delay to simulate network latency.

**`src/lib/api-real.ts`** — calls the real API routes using `fetch`. Same exported function names and signatures as `api-mock.ts`:

- `diagnoseReal(input)` — POST `/api/diagnose`
- `getPartsReal(faultKey)` — POST `/api/parts`
- `getSuppliersReal(categories, lat, lng)` — GET `/api/suppliers`

On any fetch error, throw so the caller can handle retries.

**`src/lib/api.ts`** — re-exports from one of the above two files. On day 1, re-export from `api-mock.ts`. On day 2, change to `api-real.ts`. One line change. No screen component touches this logic.

### Constraints

Screen components never call `fetch` directly. All API interaction goes through `src/lib/api.ts`.

All types (`DiagnosisResult`, `PartsResult`, `Supplier`) are imported from `src/lib/types.ts`. Dev 1's shared types feature must be committed before this feature starts.

### Scope

Only the three `src/lib/api*.ts` files are created. No screen files are touched in this feature.

### Check When Done

- `api-mock.ts` returns typed responses for all three endpoints
- `api-real.ts` calls the correct routes with correct HTTP methods
- `api.ts` re-exports from mock (for now)
- TypeScript compiles without errors
- Switching from mock to real requires changing one line in `api.ts`
