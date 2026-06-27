import { createFileRoute } from "@tanstack/react-router";
import { DiagnoseInputSchema } from "../../lib/schemas";
import { runDiagnosisAgent } from "../../lib/agent";

const SAFETY_KEYWORDS = [
  "brake",
  "fire",
  "emergency",
  "steering loss",
  "no brakes",
  "smoke",
];

function hasSafetyKeyword(description: string): boolean {
  const lower = description.toLowerCase();
  return SAFETY_KEYWORDS.some((kw) => lower.includes(kw));
}

export const Route = createFileRoute("/api/diagnose")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const parsed = DiagnoseInputSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { description, severity, location } = parsed.data;
        const forceSafetyCritical = hasSafetyKeyword(description);

        const result = await runDiagnosisAgent(description, severity, location);

        if (forceSafetyCritical) {
          result.safetyCritical = true;
        }

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
