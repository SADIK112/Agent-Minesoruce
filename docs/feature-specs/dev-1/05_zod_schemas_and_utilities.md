Create shared Zod schemas and utility files used by the API routes and agent.

### Zod Schemas

Create `src/lib/schemas.ts`. Export a Zod schema for every API input and output shape defined in `src/lib/types.ts`:

- `DiagnoseInputSchema` — validates POST /api/diagnose request body
- `DiagnosisResultSchema` — validates the agent's JSON output before trusting it
- `PartsInputSchema` — validates POST /api/parts request body
- `SuppliersQuerySchema` — validates GET /api/suppliers query parameters

All schemas derive from the interfaces in `src/lib/types.ts`. No shapes are defined here that aren't already in types.ts.

### Haversine Utility

Create `src/lib/haversine.ts`. Export a single function that takes two lat/lng pairs and returns the distance in kilometres between them. No external library — implement the formula directly.

### Demo Fallback

Create `src/lib/demo-fallback.ts`. Export a constant `DEMO_FALLBACK` of type `DiagnosisResult` hardcoded to the "hose burst" scenario:

- `faults` contains one entry: `hose-burst` with confidence 0.91 and `safetyCritical: true`
- `summary` is a plain-language description of a high-pressure hose failure
- `safetyCritical` is `true` at the top level

This exact value is returned by the agent orchestrator whenever the LLM call fails or times out, guaranteeing the demo always has a working response.

### Scope

No API routes. No tool functions. No agent logic. Only the three files listed above.

### Check When Done

- `src/lib/schemas.ts` exports four Zod schemas matching the API types
- `src/lib/haversine.ts` exports a working distance function
- `src/lib/demo-fallback.ts` exports `DEMO_FALLBACK` typed as `DiagnosisResult` with `safetyCritical: true`
- TypeScript compiles without errors
