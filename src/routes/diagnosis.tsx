import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, ShieldAlert, Pencil, ChevronRight, AlertTriangle } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/northfix/AppShell";
import { useNorthFix } from "@/lib/northfix-store";

export const Route = createFileRoute("/diagnosis")({
  head: () => ({
    meta: [
      { title: "Diagnosis · NorthFix" },
      { name: "description", content: "Review likely faults, severity, and safety guidance for the reported issue." },
    ],
  }),
  component: DiagnosisPage,
});

const AGENT_STEPS = [
  "Searching failure records",
  "Matching fault patterns",
  "Checking safety flags",
  "Preparing summary",
];

const PRIMARY = {
  fault: "Hydraulic hose abrasion / fitting leak",
  confidence: 72,
  reasoning:
    "Symptoms suggest a high-pressure hose has chafed against the boom or a JIC fitting is weeping. Fluid loss on the floor combined with sluggish lift response is consistent with leak-driven pressure drop rather than pump or cylinder failure.",
  severity: "High",
  hours: "4–8 hrs",
};

const ALTERNATIVES = [
  {
    fault: "Cylinder seal failure",
    confidence: 18,
    reasoning: "Possible if leakage is internal — check for slow drift under load with engine off.",
  },
  {
    fault: "Hydraulic fluid contamination",
    confidence: 10,
    reasoning: "Less likely but worth a sample if fluid looks milky or metallic.",
  },
];

function DiagnosisPage() {
  const router = useRouter();
  const { report } = useNorthFix();
  const [loading, setLoading] = useState(true);
  const [agentIdx, setAgentIdx] = useState(0);
  const [openAlt, setOpenAlt] = useState<number | null>(null);

  useEffect(() => {
    if (!report.symptom) {
      router.navigate({ to: "/report" });
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setAgentIdx(i);
      if (i >= AGENT_STEPS.length) {
        clearInterval(id);
        setTimeout(() => setLoading(false), 250);
      }
    }, 420);
    return () => clearInterval(id);
  }, []);

  const safetyCritical = report.severity === "unsafe";
  const lowConfidence = PRIMARY.confidence < 40;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6 sm:px-6">
        {safetyCritical && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg bg-destructive p-4 text-destructive-foreground shadow-sm"
          >
            <ShieldAlert className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide">Stop — do not operate</p>
              <p className="mt-1 text-sm">
                Equipment must be inspected and cleared by your supervisor before restart.
              </p>
            </div>
          </div>
        )}

        {!loading && lowConfidence && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/15 p-3 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
            <p className="text-foreground">
              Multiple possible causes — physical inspection recommended before ordering parts.
            </p>
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Diagnosis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {report.equipment} · {report.subsystem} · {report.location[0].toUpperCase() + report.location.slice(1)}
        </p>

        {loading ? (
          <>
            <div className="mt-6 rounded-lg border border-border bg-surface p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Working on it
              </p>
              <ul className="space-y-2.5">
                {AGENT_STEPS.map((s, i) => {
                  const done = i < agentIdx;
                  const active = i === agentIdx;
                  return (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span
                        className={[
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          done
                            ? "bg-success text-success-foreground"
                            : active
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground",
                        ].join(" ")}
                      >
                        {done ? <Check className="h-3 w-3" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      </span>
                      <span className={done ? "text-foreground" : active ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {s}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-5 space-y-3">
              <Skeleton h={150} />
              <Skeleton h={70} />
              <Skeleton h={70} />
            </div>
          </>
        ) : (
          <>
            <article className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-sm ring-1 ring-primary/5 border-l-4 border-l-primary">
              <header className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground">{PRIMARY.fault}</h2>
                <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-bold tabular text-primary-foreground">
                  {PRIMARY.confidence}% match
                </span>
              </header>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{PRIMARY.reasoning}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone="destructive">Severity: {PRIMARY.severity}</Pill>
                <Pill>Est. repair {PRIMARY.hours}</Pill>
                <Pill>{report.location[0].toUpperCase() + report.location.slice(1)}</Pill>
              </div>
            </article>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Alternative possibilities
            </h3>
            <div className="mt-2 space-y-2">
              {ALTERNATIVES.map((a, i) => {
                const open = openAlt === i;
                return (
                  <button
                    key={a.fault}
                    onClick={() => setOpenAlt(open ? null : i)}
                    className="w-full rounded-lg border border-border border-l-4 border-l-muted-foreground/30 bg-surface p-3.5 text-left transition hover:border-l-primary/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">{a.fault}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tabular text-muted-foreground">{a.confidence}%</span>
                        <ChevronRight className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                    {open && <p className="mt-2 text-xs text-muted-foreground">{a.reasoning}</p>}
                  </button>
                );
              })}
            </div>

            <section className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
              <h3 className="text-sm font-semibold text-foreground">Safety notes</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Lock out / tag out before inspecting hydraulic lines.</li>
                <li>Inspect for fluid contamination and chafe points before restart.</li>
                <li>Confirm reservoir level after repair; bleed lines as required.</li>
              </ul>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-start">
              <Link
                to="/parts"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 sm:w-auto sm:min-w-[240px]"
              >
                View parts checklist
              </Link>
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
                Not right? Edit report
              </Link>
            </div>
          </>
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "destructive" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "destructive"
          ? "bg-destructive/10 text-destructive"
          : "bg-secondary text-foreground",
      ].join(" ")}
    >
      {children}
    </span>
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
