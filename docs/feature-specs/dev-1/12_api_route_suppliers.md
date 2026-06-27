Build the GET /api/suppliers route.

### Route File

Create `src/routes/api/suppliers.ts` using `createAPIFileRoute`.

### Input Validation

Read query parameters: `categories` (comma-separated string), `lat` (float), `lng` (float). Validate with `SuppliersQuerySchema` from `src/lib/schemas.ts`.

If `lat` or `lng` are missing or not valid numbers, default to Sudbury city centre coordinates (`46.4917, -80.9930`) rather than returning an error. The supplier list must always load.

If `categories` is missing or empty, pass an empty array to the tool — the tool returns all suppliers ranked by distance.

### Suppliers Lookup

Parse `categories` from comma-separated string into an array. Call `findLocalSuppliers(categories, lat, lng)` from `src/lib/tools/find-local-suppliers.ts`.

### Response

Return `Supplier[]` directly. The list is never empty — the tool guarantees at least one result.

### Scope

Only `src/routes/api/suppliers.ts` is created. The suppliers tool (feature 08) must be in place before this route can run end to end.

### Check When Done

- Route returns a ranked `Supplier[]` for valid query params
- Route defaults `lat`/`lng` to Sudbury centre when missing — no 400 error
- Route returns all suppliers ranked by distance when `categories` is empty
- TypeScript compiles without errors
