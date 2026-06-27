Build the POST /api/parts route.

### Route File

Create `src/routes/api/parts.ts` using `createAPIFileRoute`.

### Input Validation

Parse the request body. Validate with `PartsInputSchema` from `src/lib/schemas.ts`. If validation fails, return HTTP 400 with `{ error: "Invalid request" }`.

### Parts Lookup

Call `getPartsForFault(faultKey)` from `src/lib/tools/get-parts-for-fault.ts`.

### Response

Return the `PartsResult` directly. If `faultKey` was not found in the data, the tool returns empty arrays — return those as-is. Never return 404 for an unknown fault key.

### Scope

Only `src/routes/api/parts.ts` is created. The parts tool (feature 07) must be in place before this route can run end to end.

### Check When Done

- Route returns HTTP 400 for missing `faultKey`
- Route returns HTTP 200 with `PartsResult` for a valid `faultKey`
- Route returns HTTP 200 with empty part arrays for an unknown `faultKey`
- TypeScript compiles without errors
