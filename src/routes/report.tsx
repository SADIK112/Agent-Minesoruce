import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Mic, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { AppHeader, AppFooter, Modal } from "@/components/minesource/AppShell";
import { useMineSource, type Severity, type Location } from "@/lib/minesource-store";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an issue · Agent MineSource" },
      { name: "description", content: "Describe the breakdown to get a likely diagnosis and parts list." },
    ],
  }),
  component: ReportPage,
});

const EXAMPLES = [
  "Hose burst at bucket cylinder, fluid on the floor",
  "Overheating on ramp, slow lift response",
  "Spongy brakes, unsafe to operate",
];

const SEVERITIES: { value: Severity; label: string; desc: string; tone: string }[] = [
  { value: "rough", label: "Running rough", desc: "Equipment works but degraded", tone: "warning" },
  { value: "stopped", label: "Stopped", desc: "Down — won't operate", tone: "accent" },
  { value: "unsafe", label: "Unsafe", desc: "Stop-work — safety risk", tone: "destructive" },
];

function ReportPage() {
  const router = useRouter();
  const { report, setReport } = useMineSource();
  const [error, setError] = useState<string | null>(null);
  const [sevError, setSevError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);

  const submit = () => {
    const symptom = report.symptom.trim();
    let ok = true;
    if (symptom.length < 10) {
      setError("Please describe the symptom (at least a short sentence).");
      ok = false;
    } else setError(null);
    if (!report.severity) {
      setSevError("Select how severe the issue is.");
      ok = false;
    } else setSevError(null);
    if (!ok) return;

    if (report.severity === "unsafe") {
      setSafetyOpen(true);
      return;
    }
    proceed();
  };

  const proceed = () => {
    setSubmitting(true);
    setTimeout(() => router.navigate({ to: "/diagnosis" }), 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Report an issue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what happened. Plain language is fine — no codes needed.
        </p>

        <section className="mt-6 space-y-2">
          <Label>Equipment</Label>
          <FixedChip label="LHD" />
        </section>

        <section className="mt-5 space-y-2">
          <Label>Subsystem</Label>
          <FixedChip label="Hydraulics" />
          <p className="text-xs text-muted-foreground">MVP focuses on LHD hydraulics.</p>
        </section>

        <section className="mt-6">
          <Label htmlFor="symptom" required>
            Symptom
          </Label>
          <div className="relative mt-1.5">
            <textarea
              id="symptom"
              value={report.symptom}
              onChange={(e) => {
                setReport({ symptom: e.target.value });
                if (error) setError(null);
              }}
              placeholder="Describe what happened — leaks, sounds, smells, what stopped working…"
              rows={4}
              className={[
                "w-full resize-y rounded-lg border bg-surface px-3 py-2.5 pr-11 text-sm shadow-sm outline-none transition",
                "focus:ring-2 focus:ring-ring/40",
                error ? "border-destructive focus:border-destructive" : "border-input focus:border-primary",
              ].join(" ")}
            />
            <button
              type="button"
              aria-label="Voice input"
              title="Voice input (coming soon)"
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
          {error ? (
            <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
          ) : (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {report.symptom.length} characters · be specific about what stopped working
            </p>
          )}

          <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setReport({ symptom: ex });
                  setError(null);
                  setHighlight(i);
                  setTimeout(() => setHighlight(null), 600);
                }}
                className={[
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  highlight === i
                    ? "border-accent bg-accent/15 text-accent-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
                ].join(" ")}
              >
                {ex}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <Label required>How bad is it?</Label>
          <div className="mt-2 space-y-2" role="radiogroup" aria-label="Severity">
            {SEVERITIES.map((s) => {
              const selected = report.severity === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setReport({ severity: s.value });
                    setSevError(null);
                  }}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg border bg-surface p-3.5 text-left transition",
                    "min-h-[56px]",
                    selected
                      ? s.tone === "destructive"
                        ? "border-destructive ring-2 ring-destructive/20"
                        : s.tone === "warning"
                          ? "border-warning ring-2 ring-warning/30"
                          : "border-accent ring-2 ring-accent/30"
                      : "border-border hover:border-primary/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                      selected
                        ? s.tone === "destructive"
                          ? "border-destructive bg-destructive text-destructive-foreground"
                          : s.tone === "warning"
                            ? "border-warning bg-warning text-warning-foreground"
                            : "border-accent bg-accent text-accent-foreground"
                        : "border-muted-foreground/40",
                    ].join(" ")}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.desc}</span>
                  </span>
                  {s.value === "unsafe" && (
                    <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>
          {sevError && <p className="mt-1.5 text-xs font-medium text-destructive">{sevError}</p>}
        </section>

        <section className="mt-7">
          <Label htmlFor="location">Location</Label>
          <select
            id="location"
            value={report.location}
            onChange={(e) => setReport({ location: e.target.value as Location })}
            className="mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 sm:w-64"
          >
            <option value="underground">Underground</option>
            <option value="surface">Surface</option>
            <option value="shop">Shop</option>
          </select>
        </section>

        <aside className="mt-8 hidden rounded-lg border border-border bg-secondary/60 p-4 sm:block">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-accent" />
            Tips for a good report
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            <li>Mention the location on the machine (boom, bucket, brakes, etc.).</li>
            <li>Note fluid color or smell if visible.</li>
            <li>Say when it started — mid-shift, after refuel, on the ramp.</li>
          </ul>
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-2xl sm:justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-60 sm:w-auto sm:min-w-[240px]"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : "Get diagnosis"}
          </button>
        </div>
      </div>

      <AppFooter />

      {safetyOpen && (
        <Modal onClose={() => setSafetyOpen(false)} title="Safety-critical report" accent="danger">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-sm text-foreground">
              Stop the equipment. Notify your supervisor before continuing. Agent MineSource will still help
              prepare parts information but cannot clear equipment for operation.
            </p>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => setSafetyOpen(false)}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Go back
            </button>
            <button
              onClick={() => {
                setSafetyOpen(false);
                proceed();
              }}
              className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90"
            >
              I understand — continue
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-foreground">
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  );
}

function FixedChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary"
      title="MVP focuses on LHD hydraulics"
    >
      <Check className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
