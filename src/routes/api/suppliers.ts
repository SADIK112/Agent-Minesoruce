import { createFileRoute } from "@tanstack/react-router";
import { SuppliersQuerySchema } from "../../lib/schemas";
import { findLocalSuppliers } from "../../lib/tools/find-local-suppliers";

export const Route = createFileRoute("/api/suppliers")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const raw = {
          categories: url.searchParams.get("categories") ?? undefined,
          lat: url.searchParams.get("lat") ?? undefined,
          lng: url.searchParams.get("lng") ?? undefined,
        };

        const parsed = SuppliersQuerySchema.safeParse(raw);
        const { categories: categoriesStr, lat, lng } = parsed.success
          ? parsed.data
          : { categories: "", lat: 46.4917, lng: -80.993 };

        const categories = categoriesStr
          ? categoriesStr.split(",").map((c) => c.trim()).filter(Boolean)
          : [];

        const result = findLocalSuppliers(categories, lat, lng);

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
