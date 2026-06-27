Build the POST /api/diagnose route.

### Route File

Create `src/routes/api/diagnose.ts` using `createAPIFileRoute`.

### Input Validation

Parse the request body. Validate with `DiagnoseInputSchema` from `src/lib/schemas.ts`. If validation fails, return HTTP 400 with `{ error: "Invalid request" }`.

### Safety Keyword Check

Before calling the agent, check the report description for safety-critical keywords: "brake", "fire", "emergency", "steering loss", "no brakes", "smoke". This check runs on the raw description string — case-insensitive.

If any keyword matches, set `safetyCritical: true` in the final response regardless of what the agent returns.

### Agent Call

Call `runDiagnosisAgent(description, severity, location)` from `src/lib/agent.ts`. The agent has its own 15-second timeout and fallback — this route does not need an additional timeout.

### Response

Return the `DiagnosisResult` from the agent, overriding `safetyCritical` to `true` if the keyword check matched.

Always return HTTP 200 with a valid `DiagnosisResult`. The agent's fallback guarantees this — the route never returns an empty body or 500.

### Scope

Only `src/routes/api/diagnose.ts` is created. The agent (feature 09) must be in place before this route can run end to end.

### Check When Done

- Route returns HTTP 400 for missing or invalid fields
- Safety keyword check fires before the agent call
- `safetyCritical` is forced true when keywords match, regardless of agent output
- Route always returns a valid `DiagnosisResult` — never an unhandled error
- TypeScript compiles without errors
