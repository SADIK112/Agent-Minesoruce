import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldAlert, Pencil } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";
import { useMineSource } from "@/lib/minesource-store";
import { DEMO_FALLBACK, diagnose, toDiagnoseInput } from "@/lib/api";

export const Route = createFileRoute("/diagnosis")({
  head: () => ({
    meta: [
      { title: "Diagnosis · Agent MineSource" },
      {
        name: "description",
        content: "Review likely faults, severity, and safety guidance for the reported issue.",
      },
    ],
  }),
  component: DiagnosisPage,
});

function DiagnosisPage() {
  const router = useRouter();
  const { report, diagnosis, setDiagnosis, screenStatus, setScreenStatus } = useMineSource();

  const isLoading = screenStatus.diagnosis === "loading";

  useEffect(() => {
    if (!report.symptom.trim()) {
      router.navigate({ to: "/report" });
      return;
    }

    let cancelled = false;

    async function loadDiagnosis() {
      setScreenStatus("diagnosis", "loading");
      const input = toDiagnoseInput(report);

      const fetchOnce = () => diagnose(input);

      try {
        const result = await fetchOnce();
        if (!cancelled) setDiagnosis(result);
      } catch {
        try {
          const result = await fetchOnce();
          if (!cancelled) setDiagnosis(result);
        } catch {
          if (!cancelled) setDiagnosis(DEMO_FALLBACK);
        }
      }
    }

    void loadDiagnosis();

    return () => {
      cancelled = true;
    };
  }, [
    report.symptom,
    report.severity,
    report.location,
    router,
    setDiagnosis,
    setScreenStatus,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6 sm:px-6">
        {diagnosis?.safetyCritical && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg bg-destructive p-4 text-destructive-foreground shadow-sm"
          >
            <ShieldAlert className="h-6 w-6 shrink-0" />
            <p className="text-sm font-bold uppercase tracking-wide">
              STOP WORK — Safety-critical fault detected. Do not operate this equipment.
            </p>
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Diagnosis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {report.equipment} · {report.subsystem} ·{" "}
          {report.location[0].toUpperCase() + report.location.slice(1)}
        </p>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            <Skeleton h={120} />
            <Skeleton h={120} />
            <Skeleton h={120} />
          </div>
        ) : (
          diagnosis && (
            <>
              <div className="mt-6 space-y-3">
                {diagnosis.faults.map((fault, index) => (
                  <article
                    key={fault.key}
                    className={[
                      "rounded-xl border border-border bg-surface p-5 shadow-sm",
                      index === 0 ? "border-l-4 border-l-primary ring-1 ring-primary/5" : "border-l-4 border-l-muted-foreground/30",
                    ].join(" ")}
                  >
                    <header className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-bold text-foreground sm:text-lg">
                        {fault.description}
                      </h2>
                      <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-bold tabular text-primary-foreground">
                        {Math.round(fault.confidence * 100)}% match
                      </span>
                    </header>
                  </article>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-foreground/90">{diagnosis.summary}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-start">
                <Link
                  to="/parts"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 sm:w-auto sm:min-w-[240px]"
                >
                  Continue to Parts
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
          )
        )}
      </main>
      <AppFooter />
    </div>
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
