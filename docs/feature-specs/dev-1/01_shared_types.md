Create the shared TypeScript interfaces used by both developers.

### Type File

Create `src/lib/types.ts`. Both developers import from this file — no type is defined anywhere else.

### Interfaces to Define

**ReportData** — what the worker submits on the report screen:
- `description` — free-text breakdown description
- `severity` — one of `"low" | "medium" | "high" | "critical"`
- `location` — one of `"surface" | "underground" | "ramp" | "shaft"`

**FaultEntry** — one probable fault from the agent:
- `key` — kebab-case identifier matching a fault key in `failure_to_parts.json`
- `description` — plain-language fault description
- `confidence` — float 0.0–1.0
- `safetyCritical` — boolean

**DiagnosisResult** — the full agent response:
- `faults` — `FaultEntry[]`
- `summary` — plain-language diagnosis summary
- `safetyCritical` — boolean (true if any fault in the array is safety-critical)

**PartsResult** — what the parts API returns:
- `faultKey` — the key that was looked up
- `primaryParts` — string array of part categories
- `relatedParts` — string array of related part categories

**Supplier** — one supplier from the data file:
- `id`, `name`, `address`, `phone`, `website` — strings
- `lat`, `lng` — numbers
- `categories` — string array

**KnowledgeChunk** — one knowledge search result:
- `id`, `text`, `subsystem` — strings
- `faultKey` — optional string

### Rules

No `any`. No optional fields that should be required. No union types beyond what is listed above. Do not add fields that are not listed — this file is shared and must not grow without both developers agreeing.

### Scope

Only `src/lib/types.ts` is created. No implementation code in this feature.

### Check When Done

- `src/lib/types.ts` exports all six interfaces
- TypeScript compiles without errors with `strict: true`
- No `any` types used
