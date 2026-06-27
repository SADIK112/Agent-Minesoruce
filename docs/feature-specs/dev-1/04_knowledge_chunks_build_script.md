Build the knowledge chunk index used by the agent's search tool.

### Source Document

Create `scripts/raw-knowledge.md` — a plain markdown document containing 2,000–4,000 words of LHD hydraulic maintenance knowledge. Write this by hand using publicly available information about:

- Common hydraulic system failures in underground mining equipment
- Symptoms and causes for each of the 10 fault keys in `failure_to_parts.json`
- General LHD hydraulic system descriptions

No proprietary OEM content. Public knowledge only.

### Build Script

Create `scripts/build-knowledge-chunks.ts`. When run with `bun scripts/build-knowledge-chunks.ts`, it:

- Reads `scripts/raw-knowledge.md`
- Splits the text into chunks of approximately 150–200 words with a 30-word overlap between adjacent chunks
- Assigns each chunk a unique `id` (e.g., `chunk-001`)
- Tags each chunk with `subsystem: "hydraulics"` and optionally a `faultKey` if the chunk is clearly about one of the 10 known faults
- Writes the result to `src/data/knowledge-chunks.json`

### Output Format

Each element in `knowledge-chunks.json` contains:

- `id` — unique string
- `text` — the chunk content
- `subsystem` — always `"hydraulics"` for now
- `faultKey` — optional, one of the 10 fault keys if applicable

### Scope

The script runs once to generate the file. It does not run at request time. The search tool reads `knowledge-chunks.json` directly — no runtime dependency on the script.

### Check When Done

- `scripts/raw-knowledge.md` exists with 2,000–4,000 words of hydraulic content
- `scripts/build-knowledge-chunks.ts` runs without errors with `bun scripts/build-knowledge-chunks.ts`
- `src/data/knowledge-chunks.json` is generated with 80–150 chunks
- Every chunk has `id`, `text`, and `subsystem`
- Script can be re-run to regenerate the file
