import { createFileRoute } from "@tanstack/react-router";
import { PartsInputSchema } from "../../lib/schemas";
import { getPartsForFault } from "../../lib/tools/get-parts-for-fault";

export const Route = createFileRoute("/api/parts")({
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

        const parsed = PartsInputSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const result = getPartsForFault(parsed.data.faultKey);

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
