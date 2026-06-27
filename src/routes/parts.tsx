import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Copy, Info, Wrench, Check, AlertCircle } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";
import { useMineSource } from "@/lib/minesource-store";
import { getParts } from "@/lib/api";

export const Route = createFileRoute("/parts")({
  head: () => ({
    meta: [
      { title: "Parts checklist · Agent MineSource" },
      { name: "description", content: "Suggested part categories for the diagnosed fault — confirm SKUs with your supplier." },
    ],
  }),
  component: PartsPage,
});

function PartsPage() {
  const router = useRouter();
  const { diagnosis, partsResult, screenStatus, setPartsResult, setScreenStatus } = useMineSource();

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const faultKey = diagnosis?.faults[0]?.key ?? null;

  const fetchParts = useCallback(async (key: string, isRetry = false) => {
    setScreenStatus("parts", "loading");
    setError(false);
    try {
      const result = await getParts(key);
      setPartsResult(result);
      // Default all items to checked
      const init: Record<string, boolean> = {};
      result.primaryParts.forEach((p) => { init[`primary:${p}`] = true; });
      result.relatedParts.forEach((p) => { init[`related:${p}`] = true; });
      setChecked(init);
    } catch {
      if (!isRetry) {
        // Retry once
        try {
          const result = await getParts(key);
          setPartsResult(result);
          const init: Record<string, boolean> = {};
          result.primaryParts.forEach((p) => { init[`primary:${p}`] = true; });
          result.relatedParts.forEach((p) => { init[`related:${p}`] = true; });
          setChecked(init);
        } catch {
          setScreenStatus("parts", "error");
          setError(true);
        }
      } else {
        setScreenStatus("parts", "error");
        setError(true);
      }
    }
  }, [setPartsResult, setScreenStatus]);

  useEffect(() => {
    if (!diagnosis) {
      router.navigate({ to: "/diagnosis" });
      return;
    }
    if (partsResult !== null) return;
    if (!faultKey) return;
    fetchParts(faultKey);
  }, []);

  const loading = screenStatus.parts === "loading";
  const anyChecked = Object.values(checked).some(Boolean);

  const onCopy = async () => {
    if (!partsResult) return;
    const primary = partsResult.primaryParts
      .filter((p) => checked[`primary:${p}`])
      .map((p) => `- ${p}`)
      .join("\n");
    const related = partsResult.relatedParts
      .filter((p) => checked[`related:${p}`])
      .map((p) => `- ${p}`)
      .join("\n");
    const text = [
      `Agent MineSource parts list`,
      `Fault: ${faultKey}`,
      ``,
      primary ? `Primary:\n${primary}` : "",
      related ? `Related:\n${related}` : "",
      ``,
      `Suggested categories — confirm part numbers with your supplier.`,
    ].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setToast("List copied");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Couldn't copy — try again");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Parts checklist</h1>

        {faultKey && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Wrench className="h-3 w-3 text-accent" />
            {faultKey}
          </div>
        )}

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-info/30 bg-info/10 p-3 text-sm">
          <Info className="h-4 w-4 shrink-0 text-info-foreground" />
          <p className="text-foreground">
            <span className="font-semibold">Suggested categories</span> — confirm part numbers with your supplier.
          </p>
        </div>

        {loading && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-secondary/60" />
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg border border-border bg-secondary/60" />)}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-secondary/60" />
              {[1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg border border-border bg-secondary/60" />)}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-foreground">Could not load parts list. Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => faultKey && fetchParts(faultKey, true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && partsResult && (
          <>
            <h2 className="mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary parts</h2>
            <ul className="mt-2 space-y-2">
              {partsResult.primaryParts.map((part) => {
                const key = `primary:${part}`;
                return (
                  <PartRow
                    key={key}
                    label={part}
                    tier="primary"
                    checked={!!checked[key]}
                    onToggle={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
                  />
                );
              })}
            </ul>

            <h2 className="mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Related — while you're in there</h2>
            <ul className="mt-2 space-y-2">
              {partsResult.relatedParts.map((part) => {
                const key = `related:${part}`;
                return (
                  <PartRow
                    key={key}
                    label={part}
                    tier="related"
                    checked={!!checked[key]}
                    onToggle={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
                  />
                );
              })}
            </ul>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-2xl flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onCopy}
            disabled={loading || error || !anyChecked}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy list
          </button>
          <button
            type="button"
            disabled={loading || error || !partsResult}
            onClick={() => router.navigate({ to: "/suppliers" })}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
          >
            Find suppliers
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

function PartRow({
  label, tier, checked, onToggle,
}: {
  label: string;
  tier: "primary" | "related";
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        className={[
          "flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-surface p-3.5 transition min-h-[56px]",
          checked ? "border-primary/30 bg-primary/[0.02]" : "border-border hover:border-primary/20",
        ].join(" ")}
      >
        <span
          className={[
            "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition",
            checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
          ].join(" ")}
        >
          {checked && <Check className="h-3.5 w-3.5" />}
        </span>
        <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{label}</span>
        {tier === "primary" ? (
          <span className="shrink-0 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            Required
          </span>
        ) : (
          <span className="shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
            Recommended
          </span>
        )}
      </label>
    </li>
  );
}
