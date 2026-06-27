Build the knowledge search tool used by the AI agent.

### Tool Function

Create `src/lib/tools/search-failure-knowledge.ts`. Export a single pure function:

```
searchFailureKnowledge(query: string, topN?: number): KnowledgeChunk[]
```

- Reads `src/data/knowledge-chunks.json` at call time (server-side only)
- Scores each chunk against the query using keyword overlap — count how many words from the query appear in the chunk text, case-insensitive
- Returns the top N chunks sorted by score, highest first
- Default `topN` is 5
- If no chunks score above zero, return the first 3 chunks as a fallback

### Tool Registration Shape

The function will be wrapped by the agent orchestrator in feature 09. This feature only creates the pure function — no Vercel AI SDK tool registration here.

### Constraints

- No vector embeddings. No external library for similarity. Keyword overlap only.
- Reads the JSON file synchronously using `Bun.file` or `fs.readFileSync` — not `fetch`.
- Returns typed `KnowledgeChunk[]` using the interface from `src/lib/types.ts`.
- Never called from client-side code.

### Scope

Only `src/lib/tools/search-failure-knowledge.ts` is created. The agent file and API routes are separate features.

### Check When Done

- `src/lib/tools/search-failure-knowledge.ts` exports the function with the correct signature
- Calling it with a query returns an array of `KnowledgeChunk` objects
- Calling it with a query that has no matches returns 3 fallback chunks
- TypeScript compiles without errors
