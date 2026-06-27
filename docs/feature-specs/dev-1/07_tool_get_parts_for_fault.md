Build the parts lookup tool called by the /api/parts route.

### Tool Function

Create `src/lib/tools/get-parts-for-fault.ts`. Export a single pure function:

```
getPartsForFault(faultKey: string): PartsResult
```

- Reads `src/data/failure_to_parts.json` at call time (server-side only)
- Finds the entry whose `faultKey` matches the argument
- Returns a `PartsResult` with `primaryParts` and `relatedParts` arrays
- If no matching entry is found, return a `PartsResult` with both arrays empty — no error thrown

### Constraints

- Pure function. No LLM call. No network request.
- Reads the JSON file synchronously.
- Returns typed `PartsResult` using the interface from `src/lib/types.ts`.
- Part category strings pass through unchanged — no modification, no filtering.
- Never called from client-side code.

### Scope

Only `src/lib/tools/get-parts-for-fault.ts` is created. The API route that calls this function is a separate feature.

### Check When Done

- `src/lib/tools/get-parts-for-fault.ts` exports the function with the correct signature
- Calling it with a known `faultKey` returns the matching parts
- Calling it with an unknown `faultKey` returns empty arrays (not an error)
- TypeScript compiles without errors
