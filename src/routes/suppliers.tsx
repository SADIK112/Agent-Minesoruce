import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Phone, MapPin, Check, AlertCircle } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";
import { useMineSource } from "@/lib/minesource-store";
import { getSuppliers } from "@/lib/api";
import { SupplierMap } from "@/components/minesource/SupplierMap";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Local suppliers · Agent MineSource" },
      { name: "description", content: "Nearby Sudbury suppliers for hydraulic parts — sorted by best match and nearest distance." },
    ],
  }),
  component: SuppliersPage,
});

const SUDBURY_DEFAULT = { lat: 46.4917, lng: -80.993 };

function SuppliersPage() {
  const router = useRouter();
  const { partsResult, suppliers, screenStatus, setSuppliers, setScreenStatus } = useMineSource();

  const [coords, setCoords] = useState(SUDBURY_DEFAULT);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const categories = partsResult?.primaryParts ?? [];

  const fetchSuppliers = useCallback(async (lat: number, lng: number, cats: string[], isRetry = false) => {
    setScreenStatus("suppliers", "loading");
    setError(false);
    try {
      const result = await getSuppliers(cats, lat, lng);
      setSuppliers(result);
    } catch {
      if (!isRetry) {
        try {
          const result = await getSuppliers(cats, lat, lng);
          setSuppliers(result);
        } catch {
          setSuppliers([]);
          setScreenStatus("suppliers", "error");
          setError(true);
        }
      } else {
        setSuppliers([]);
        setScreenStatus("suppliers", "error");
        setError(true);
      }
    }
  }, [setSuppliers, setScreenStatus]);

  useEffect(() => {
    // Only fetch once
    if (suppliers !== null) return;

    const run = (lat: number, lng: number) => {
      setCoords({ lat, lng });
      fetchSuppliers(lat, lng, categories);
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => run(pos.coords.latitude, pos.coords.longitude),
        () => run(SUDBURY_DEFAULT.lat, SUDBURY_DEFAULT.lng),
        { timeout: 5000 },
      );
    } else {
      run(SUDBURY_DEFAULT.lat, SUDBURY_DEFAULT.lng);
    }
  }, []);

  const loading = screenStatus.suppliers === "loading";

  const onDone = () => {
    setToast("Report complete");
    setTimeout(() => router.navigate({ to: "/" }), 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Local suppliers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Finding suppliers near Sudbury…" : "Sorted nearest first"}
        </p>

        {/* Map area */}
        <div className="mt-5">
          {loading ? (
            <div className="aspect-[16/11] w-full animate-pulse rounded-xl border border-border bg-secondary/60" />
          ) : (
            <SupplierMap suppliers={suppliers ?? []} center={coords} />
          )}
        </div>

        {/* Supplier list */}
        <div className="mt-5 space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-secondary/60" />
            ))
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-foreground">Could not load suppliers. Check your connection and try again.</p>
              <button
                type="button"
                onClick={() => fetchSuppliers(coords.lat, coords.lng, categories, true)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Retry
              </button>
            </div>
          ) : (suppliers ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No suppliers found.</p>
          ) : (
            (suppliers ?? []).map((s, i) => (
              <div
                key={s.id}
                className="rounded-xl border border-border bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold tabular text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground">{s.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {s.address}
                    </p>
                    {s.phone && (
                      <a
                        href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                      >
                        <Phone className="h-4 w-4" />
                        {s.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-5xl justify-end">
          <button
            type="button"
            onClick={onDone}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 sm:w-auto sm:min-w-[240px]"
          >
            Done
          </button>
        </div>
      </div>

      <AppFooter />

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 sm:bottom-10">
          <div className="flex items-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-success-foreground shadow-lg">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
