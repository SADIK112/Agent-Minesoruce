import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Info, Wrench, AlertTriangle, Check } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/northfix/AppShell";
import { useNorthFix, type PartItem } from "@/lib/northfix-store";

export const Route = createFileRoute("/parts")({
  head: () => ({
    meta: [
      { title: "Parts checklist · NorthFix" },
      { name: "description", content: "Suggested part categories for the diagnosed fault — confirm SKUs with your supplier." },
    ],
  }),
  component: PartsPage,
});

const DEFAULT_PARTS: PartItem[] = [
  { id: "hose", name: "High-pressure hydraulic hose assembly", qty: 1, tier: "primary", checked: true },
  { id: "fitting", name: "Hydraulic fittings (JIC / flange)", qty: 2, tier: "primary", checked: true },
  { id: "fluid", name: "Hydraulic fluid (top-up)", qty: 1, tier: "primary", checked: true },
  { id: "filter", name: "Hydraulic return filter element", qty: 1, tier: "related", checked: true },
  { id: "clamp", name: "Hose clamps / chafe sleeve", qty: 4, tier: "related", checked: true },
  { id: "oring", name: "O-ring kit (assorted)", qty: 1, tier: "related", checked: false },
];

function PartsPage() {
  const router = useRouter();
  const { parts, setParts, togglePart } = useNorthFix();
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (parts.length === 0) setParts(DEFAULT_PARTS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(id);
  }, []);

  const primaryChecked = parts.filter((p) => p.tier === "primary" && p.checked).length;
  const anyChecked = parts.some((p) => p.checked);

  const onToggle = (p: PartItem) => {
    if (p.tier === "primary" && p.checked && primaryChecked === 1) {
      setWarn("Select at least one primary part to continue.");
      return;
    }
    setWarn(null);
    togglePart(p.id);
  };

  const onCopy = async () => {
    const lines = parts
      .filter((p) => p.checked)
      .map((p) => `- ${p.name} ×${p.qty}`)
      .join("\n");
    const text = `NorthFix parts list\nFor: Hydraulic hose abrasion / fitting leak\n\n${lines}\n\nNote: suggested categories — confirm part numbers with supplier.`;
    try {
      await navigator.clipboard.writeText(text);
      setToast("List copied to clipboard");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Couldn't copy — please try again");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const onFind = () => {
    if (!anyChecked) {
      setWarn("Check at least one part to continue.");
      return;
    }
    router.navigate({ to: "/suppliers" });
  };

  const primaryParts = parts.filter((p) => p.tier === "primary");
  const relatedParts = parts.filter((p) => p.tier === "related");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Parts checklist</h1>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <Wrench className="h-3 w-3 text-accent" />
          For: Hydraulic hose abrasion / fitting leak
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-info/30 bg-info/10 p-3 text-sm">
          <Info className="h-4 w-4 shrink-0 text-info-foreground" />
          <p className="text-foreground">
            <span className="font-semibold">Suggested categories</span> — confirm part numbers with your supplier.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 space-y-2">
            <p className="text-xs text-muted-foreground">Building checklist…</p>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg border border-border bg-secondary/60" />
            ))}
          </div>
        ) : (
          <>
            <SectionLabel>Primary parts</SectionLabel>
            <ul className="mt-2 space-y-2">
              {primaryParts.map((p) => (
                <PartRow key={p.id} part={p} onToggle={() => onToggle(p)} />
              ))}
            </ul>

            <SectionLabel className="mt-6">Related — while you're in there</SectionLabel>
            <ul className="mt-2 space-y-2">
              {relatedParts.map((p) => (
                <PartRow key={p.id} part={p} onToggle={() => onToggle(p)} />
              ))}
            </ul>

            {warn && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                {warn}
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Maintenance notes</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Inspect chafe points along the boom and replace hose guards if torn.</li>
                <li>Bleed lines after refill; verify pressure at idle and full lift.</li>
                <li>Check fluid sample at next service interval.</li>
              </ul>
            </div>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-2xl flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onCopy}
            disabled={loading || !anyChecked}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy list
          </button>
          <button
            type="button"
            onClick={onFind}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60 sm:w-auto sm:min-w-[240px]"
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

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-xs font-bold uppercase tracking-wider text-muted-foreground mt-6 ${className}`}>
      {children}
    </h2>
  );
}

function PartRow({ part, onToggle }: { part: PartItem; onToggle: () => void }) {
  return (
    <li>
      <label
        className={[
          "flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-surface p-3.5 transition",
          "min-h-[56px]",
          part.checked ? "border-primary/30 bg-primary/[0.02]" : "border-border hover:border-primary/20",
        ].join(" ")}
      >
        <span
          className={[
            "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition",
            part.checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40",
          ].join(" ")}
        >
          {part.checked && <Check className="h-3.5 w-3.5" />}
        </span>
        <input
          type="checkbox"
          checked={part.checked}
          onChange={onToggle}
          className="sr-only"
        />
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{part.name}</span>
        <span className="shrink-0 text-xs tabular text-muted-foreground">×{part.qty}</span>
        {part.tier === "primary" ? (
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
