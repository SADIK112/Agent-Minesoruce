<!-- BEGIN:tanstack-agent-rules -->

# This is NOT the React/Next.js you know

This project uses TanStack Start + TanStack Router — not Next.js. APIs, file conventions, and routing differ from your training data. Read `.claude/commands/tanstack.md` before writing any route, API handler, or server function. Do not use `next/*` imports, `page.tsx`, `layout.tsx`, or Next.js Route Handler conventions here.

<!-- END:tanstack-agent-rules -->

## Application Building Context

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture-context.md` — system structure, API endpoints, data files, agent architecture, and safety invariants
3. `context/code-standards.md` — TypeScript rules, TanStack conventions, component rules, safety rules, and do-not-build list
4. `context/ai-workflow-rules.md` — development workflow, file ownership per developer, scoping rules, and demo-reliability requirements
5. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.
