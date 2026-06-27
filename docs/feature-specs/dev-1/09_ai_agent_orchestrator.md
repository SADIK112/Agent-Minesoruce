Build the AI agent orchestrator that runs the diagnosis.

### Agent Function

Create `src/lib/agent.ts`. Export a single async function:

```
runDiagnosisAgent(description: string, severity: string, location: string): Promise<DiagnosisResult>
```

### LLM Call

Use Vercel AI SDK `generateText` with model `gpt-4o-mini`.

Register one tool: `search_failure_knowledge`. When the LLM calls this tool, invoke `searchFailureKnowledge` from feature 06 and return the result.

The system prompt instructs the LLM to:
- Reason about the reported breakdown using the knowledge returned by the tool
- Return a JSON object that matches the `DiagnosisResult` shape
- List up to 3 probable faults with `key`, `description`, and `confidence` (0.0–1.0)
- Set `safetyCritical: true` in the faults array if the fault involves brakes, steering, or fire

The user prompt includes the operator's description, severity, and location.

### Timeout

Wrap the `generateText` call with a 15-second `AbortController`. If the call does not complete in 15 seconds, abort it.

### Validation

Parse the LLM's text output with `JSON.parse`. Validate the result with `DiagnosisResultSchema` from `src/lib/schemas.ts`.

### Fallback

On any failure — network error, timeout, JSON parse error, Zod validation failure — return `DEMO_FALLBACK` from `src/lib/demo-fallback.ts`. Do not throw. Do not log the error to the client.

### Scope

Only `src/lib/agent.ts` is created. The API route that calls this function is a separate feature.

### Check When Done

- `src/lib/agent.ts` exports `runDiagnosisAgent` with the correct signature
- The `search_failure_knowledge` tool is registered and calls the tool function from feature 06
- A 15-second abort timeout is in place
- Any failure returns `DEMO_FALLBACK` without throwing
- TypeScript compiles without errors
- `OPENAI_API_KEY` is read from `process.env` — never hardcoded
