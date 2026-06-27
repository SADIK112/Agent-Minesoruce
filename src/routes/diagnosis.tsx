import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldAlert, ChevronRight, Pencil } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";
import { useMineSource } from "@/lib/minesource-store";
import { diagnose } from "@/lib/api";
import { DEMO_FALLBACK } from "@/lib/demo-fallback";
import type { ReportData } from "@/lib/types";

export const Route = createFileRoute("/diagnosis")({
  head: () => ({
    meta: [
      { title: "Diagnosis · Agent MineSource" },
      { name: "description", content: "Review likely faults, severity, and safety guidance for the reported issue." },
    ],
  }),
  component: DiagnosisPage,
});

// Map UI severity labels → API values
function mapSeverity(s: string | null): ReportData["severity"] {
  if (s === "unsafe") return "critical";
  if (s === "stopped") return "high";
  return "low";
}

// Map UI location labels → API values
function mapLocation(l: string): ReportData["location"] {
  if (l === "underground") return "underground";
  if (l === "surface") return "surface";
  return "surface"; // "shop" falls back to surface
}

function DiagnosisPage() {
  const router = useRouter();
  const { report, diagnosis, screenStatus, setDiagnosis, setScreenStatus } = useMineSource();

  useEffect(() => {
    if (!report.symptom) {
      router.navigate({ to: "/report" });
      return;
    }

    // Only fetch if we don't already have a result
    if (diagnosis !== null) return;

    const input: ReportData = {
      description: report.symptom,
      severity: mapSeverity(report.severity),
      location: mapLocation(report.location),
    };

    async function fetchDiagnosis() {
      setScreenStatus("diagnosis", "loading");
      try {
        const result = await diagnose(input);
        setDiagnosis(result);
      } catch {
        // Retry once
        try {
          const result = await diagnose(input);
          setDiagnosis(result);
        } catch {
          setDiagnosis(DEMO_FALLBACK);
        }
      }
    }

    fetchDiagnosis();
  }, []);

  const loading = screenStatus.diagnosis === "loading";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6 sm:px-6">

        {/* Safety banner — cannot be dismissed */}
        {diagnosis?.safetyCritical && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg bg-destructive p-4 text-destructive-foreground shadow-sm"
          >
            <ShieldAlert className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide">Stop work — safety-critical fault detected</p>
              <p className="mt-1 text-sm">Do not operate this equipment.</p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Diagnosis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {report.equipment} · {report.subsystem} · {report.location[0].toUpperCase() + report.location.slice(1)}
        </p>

        {loading ? (
          <div className="mt-6 space-y-3">
            <Skeleton h={150} />
            <Skeleton h={90} />
            <Skeleton h={90} />
          </div>
        ) : diagnosis ? (
          <>
            {/* Fault cards */}
            <div className="mt-6 space-y-3">
              {diagnosis.faults.map((fault) => (
                <article
                  key={fault.key}
                  className="rounded-xl border border-border bg-surface p-5 shadow-sm border-l-4 border-l-primary"
                >
                  <header className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-bold text-foreground">{fault.description}</h2>
                    <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-bold tabular text-primary-foreground">
                      {Math.round(fault.confidence * 100)}% match
                    </span>
                  </header>
                  {fault.safetyCritical && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-destructive">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Safety-critical
                    </p>
                  )}
                </article>
              ))}
            </div>

            {/* Alternatives (faults beyond the first) */}
            {diagnosis.faults.length > 1 && (
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Alternative possibilities
              </h3>
            )}

            {/* Summary */}
            <section className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
              <h3 className="text-sm font-semibold text-foreground">Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{diagnosis.summary}</p>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-start">
              <Link
                to="/parts"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 sm:w-auto sm:min-w-[240px]"
              >
                Continue to parts
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit report
              </Link>
            </div>
          </>
        ) : null}

        {/* Disabled continue button while loading */}
        {loading && (
          <div className="mt-8">
            <button
              disabled
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary/50 px-6 py-3.5 text-base font-semibold text-primary-foreground sm:w-auto sm:min-w-[240px] cursor-not-allowed"
            >
              Continue to parts
            </button>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function Skeleton({ h }: { h: number }) {
  return (
    <div
      className="rounded-lg border border-border bg-secondary/60"
      style={{ height: h }}
    />
  );
}
