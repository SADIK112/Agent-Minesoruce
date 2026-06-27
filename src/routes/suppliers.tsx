import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Phone, Check } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";
import { SupplierMap } from "@/components/minesource/SupplierMap";
import { useMineSource } from "@/lib/minesource-store";
import { getSuppliers, SUDBURY_CENTER } from "@/lib/api";
import type { Supplier } from "@/lib/types";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Local suppliers · Agent MineSource" },
      {
        name: "description",
        content: "Nearby Sudbury suppliers for hydraulic parts — sorted by best match and nearest distance.",
      },
    ],
  }),
  component: SuppliersPage,
});

type Coordinates = { lat: number; lng: number };

function resolveLocation(): Promise<Coordinates> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(SUDBURY_CENTER);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => resolve(SUDBURY_CENTER),
      { timeout: 8000, maximumAge: 60_000 },
    );
  });
}

function formatTelHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `tel:${digits}` : "#";
}

function SuppliersPage() {
  const router = useRouter();
  const {
    partsResult,
    suppliers,
    setSuppliers,
    screenStatus,
    setScreenStatus,
    resetAll,
  } = useMineSource();
  const [coords, setCoords] = useState<Coordinates>(SUDBURY_CENTER);
  const [loadFailed, setLoadFailed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isLoading = screenStatus.suppliers === "loading";
  const categories = partsResult?.primaryParts ?? [];

  const loadSuppliers = useCallback(
    async (location: Coordinates, categoryList: string[]) => {
      setScreenStatus("suppliers", "loading");
      setLoadFailed(false);

      const fetchOnce = () => getSuppliers(categoryList, location.lat, location.lng);

      try {
        const result = await fetchOnce();
        setSuppliers(result);
      } catch {
        try {
          const result = await fetchOnce();
          setSuppliers(result);
        } catch {
          setSuppliers([]);
          setLoadFailed(true);
        }
      }
    },
    [setScreenStatus, setSuppliers],
  );

  useEffect(() => {
    if (!partsResult) {
      router.navigate({ to: "/parts" });
      return;
    }

    let cancelled = false;

    async function init() {
      const location = await resolveLocation();
      if (cancelled || !partsResult) return;
      setCoords(location);
      await loadSuppliers(location, partsResult.primaryParts);
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [partsResult, loadSuppliers, router]);

  const onRetry = () => {
    void loadSuppliers(coords, categories);
  };

  const onDone = () => {
    setToast("Report complete");
    resetAll();
    setTimeout(() => router.navigate({ to: "/" }), 800);
  };

  const showResults = suppliers !== null && !isLoading;
  const showEmpty = showResults && loadFailed && suppliers.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Local suppliers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? "Finding suppliers near you…" : "Sorted by best match and nearest distance"}
        </p>

        <div className="mt-5 space-y-5">
          {isLoading ? (
            <>
              <div className="aspect-[16/11] w-full animate-pulse rounded-xl border border-border bg-secondary/60" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-lg border border-border bg-secondary/60"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {showResults && !showEmpty && suppliers && suppliers.length > 0 && (
                <>
                  <SupplierMap suppliers={suppliers} center={coords} />
                  <ul className="space-y-3">
                    {suppliers.map((supplier, index) => (
                      <SupplierCard key={supplier.id} supplier={supplier} rank={index + 1} />
                    ))}
                  </ul>
                </>
              )}

              {showEmpty && (
                <>
                  <SupplierMap suppliers={[]} center={coords} />
                  <div className="rounded-lg border border-border bg-secondary/40 p-4 text-center">
                    <p className="text-sm text-foreground">
                      Could not load suppliers. Check your connection and try again.
                    </p>
                    <button
                      type="button"
                      onClick={onRetry}
                      className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Try again
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-2xl justify-end">
          <button
            type="button"
            onClick={onDone}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60 sm:w-auto sm:min-w-[240px]"
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

function SupplierCard({ supplier, rank }: { supplier: Supplier; rank: number }) {
  return (
    <li className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold tabular text-primary-foreground">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">{supplier.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{supplier.address}</p>
          <a
            href={formatTelHref(supplier.phone)}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <Phone className="h-4 w-4" />
            {supplier.phone}
          </a>
        </div>
      </div>
    </li>
  );
}
