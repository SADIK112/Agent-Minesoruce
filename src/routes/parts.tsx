import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Copy, Info, Wrench, Check } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";
import { useMineSource } from "@/lib/minesource-store";
import { getParts } from "@/lib/api";

export const Route = createFileRoute("/parts")({
  head: () => ({
    meta: [
      { title: "Parts checklist · Agent MineSource" },
      {
        name: "description",
        content: "Suggested part categories for the diagnosed fault — confirm SKUs with your supplier.",
      },
    ],
  }),
  component: PartsPage,
});

function PartsPage() {
  const router = useRouter();
  const {
    diagnosis,
    partsResult,
    setPartsResult,
    screenStatus,
    setScreenStatus,
  } = useMineSource();
  const [checkedPrimary, setCheckedPrimary] = useState<Set<string>>(new Set());
  const [checkedRelated, setCheckedRelated] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const faultKey = diagnosis?.faults[0]?.key;
  const faultLabel = diagnosis?.faults[0]?.description;
  const isLoading = screenStatus.parts === "loading";
  const isError = screenStatus.parts === "error";
  const canContinue = partsResult !== null && !isLoading && !isError;

  const loadParts = useCallback(
    async (key: string) => {
      setScreenStatus("parts", "loading");

      const fetchOnce = () => getParts(key);

      try {
        const result = await fetchOnce();
        setPartsResult(result);
      } catch {
        try {
          const result = await fetchOnce();
          setPartsResult(result);
        } catch {
          setScreenStatus("parts", "error");
        }
      }
    },
    [setPartsResult, setScreenStatus],
  );

  useEffect(() => {
    if (!faultKey) {
      router.navigate({ to: "/diagnosis" });
      return;
    }
    void loadParts(faultKey);
  }, [faultKey, loadParts, router]);

  useEffect(() => {
    if (!partsResult) return;
    setCheckedPrimary(new Set(partsResult.primaryParts));
    setCheckedRelated(new Set(partsResult.relatedParts));
  }, [partsResult]);

  const togglePrimary = (name: string) => {
    setCheckedPrimary((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleRelated = (name: string) => {
    setCheckedRelated((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const onCopy = async () => {
    if (!partsResult) return;
    const primaryLines = partsResult.primaryParts
      .filter((p) => checkedPrimary.has(p))
      .map((p) => `- ${p}`)
      .join("\n");
    const relatedLines = partsResult.relatedParts
      .filter((p) => checkedRelated.has(p))
      .map((p) => `- ${p}`)
      .join("\n");
    const text = [
      "Agent MineSource parts list",
      faultLabel ? `For: ${faultLabel}` : "",
      "",
      "Primary:",
      primaryLines || "(none selected)",
      "",
      "Related:",
      relatedLines || "(none selected)",
      "",
      "Note: suggested categories — confirm part numbers with supplier.",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setToast("List copied to clipboard");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Couldn't copy — please try again");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const onContinue = () => {
    if (canContinue) router.navigate({ to: "/suppliers" });
  };

  const anyChecked = checkedPrimary.size > 0 || checkedRelated.size > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Parts checklist</h1>
        {faultLabel && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Wrench className="h-3 w-3 text-accent" />
            For: {faultLabel}
          </div>
        )}

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-info/30 bg-info/10 p-3 text-sm">
          <Info className="h-4 w-4 shrink-0 text-info-foreground" />
          <p className="text-foreground">
            Suggested categories — confirm part numbers with your supplier.
          </p>
        </div>

        {isLoading && (
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 h-4 w-28 animate-pulse rounded bg-secondary/60" />
              <div className="space-y-2">
                <Skeleton h={56} />
                <Skeleton h={56} />
                <Skeleton h={56} />
              </div>
            </div>
            <div>
              <div className="mb-2 h-4 w-36 animate-pulse rounded bg-secondary/60" />
              <div className="space-y-2">
                <Skeleton h={56} />
                <Skeleton h={56} />
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-foreground">
              Could not load parts list. Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => faultKey && void loadParts(faultKey)}
              className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Try again
            </button>
          </div>
        )}

        {partsResult && !isLoading && !isError && (
          <>
            <SectionLabel>Primary parts</SectionLabel>
            <ul className="mt-2 space-y-2">
              {partsResult.primaryParts.map((name) => (
                <PartCheckRow
                  key={name}
                  label={name}
                  checked={checkedPrimary.has(name)}
                  onToggle={() => togglePrimary(name)}
                  variant="primary"
                />
              ))}
            </ul>

            <SectionLabel className="mt-6">Related parts</SectionLabel>
            <ul className="mt-2 space-y-2">
              {partsResult.relatedParts.map((name) => (
                <PartCheckRow
                  key={name}
                  label={name}
                  checked={checkedRelated.has(name)}
                  onToggle={() => toggleRelated(name)}
                  variant="related"
                />
              ))}
            </ul>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-2xl flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onCopy}
            disabled={!canContinue || !anyChecked}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy list
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60 sm:w-auto sm:min-w-[240px]"
          >
            Continue to Suppliers
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

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground ${className}`}>
      {children}
    </h2>
  );
}

function Skeleton({ h }: { h: number }) {
  return (
    <div
      className="animate-pulse rounded-lg border border-border bg-secondary/60"
      style={{ height: h }}
    />
  );
}

function PartCheckRow({
  label,
  checked,
  onToggle,
  variant,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  variant: "primary" | "related";
}) {
  return (
    <li>
      <label
        className={[
          "flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-surface p-3.5 transition",
          "min-h-[56px]",
          checked ? "border-primary/30 bg-primary/[0.02]" : "border-border hover:border-primary/20",
        ].join(" ")}
      >
        <span
          className={[
            "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40",
          ].join(" ")}
        >
          {checked && <Check className="h-3.5 w-3.5" />}
        </span>
        <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{label}</span>
        {variant === "primary" ? (
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
