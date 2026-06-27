Build the supplier ranking tool called by the /api/suppliers route.

### Tool Function

Create `src/lib/tools/find-local-suppliers.ts`. Export a single pure function:

```
findLocalSuppliers(categories: string[], lat: number, lng: number): Supplier[]
```

- Reads `src/data/sudbury_suppliers.json` at call time (server-side only)
- Filters the supplier list to entries whose `categories` array shares at least one value with the requested `categories`
- Ranks the filtered suppliers by distance from `lat`/`lng` using the haversine function from `src/lib/haversine.ts`
- Returns the full ranked list — no hard cap on results

### Fallback Behavior

If `categories` is empty or no suppliers match, return all suppliers ranked by distance. The screen always has suppliers to show.

### Constraints

- Pure function. No LLM call. No network request.
- Reads the JSON file synchronously.
- Returns typed `Supplier[]` using the interface from `src/lib/types.ts`.
- Never called from client-side code.

### Scope

Only `src/lib/tools/find-local-suppliers.ts` is created. The API route that calls this function is a separate feature.

### Check When Done

- `src/lib/tools/find-local-suppliers.ts` exports the function with the correct signature
- Returns suppliers sorted nearest-first
- If no suppliers match the categories, returns all suppliers ranked by distance
- TypeScript compiles without errors
