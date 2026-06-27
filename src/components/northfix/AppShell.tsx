import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, X, ShieldAlert } from "lucide-react";
import { useNorthFix } from "@/lib/northfix-store";

const STEPS = [
  { key: "report", label: "Report", short: "Report", path: "/report" },
  { key: "diagnosis", label: "Diagnose", short: "Dx", path: "/diagnosis" },
  { key: "parts", label: "Parts", short: "Parts", path: "/parts" },
  { key: "suppliers", label: "Suppliers", short: "Supp", path: "/suppliers" },
] as const;

function stepIndexForPath(pathname: string): number {
  const i = STEPS.findIndex((s) => pathname.startsWith(s.path));
  return i === -1 ? -1 : i;
}

export function AppHeader({ showStepper = true }: { showStepper?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { report } = useNorthFix();

  const active = stepIndexForPath(pathname);
  const inWizard = active >= 0;
  const hasProgress = report.symptom.trim().length > 0 || active > 0;

  const onLogoClick = (e: React.MouseEvent) => {
    if (inWizard && hasProgress) {
      e.preventDefault();
      setLeaveOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={onLogoClick}
          className="flex items-center gap-2 text-primary"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight">NorthFix</span>
        </Link>

        {showStepper && inWizard && (
          <div className="hidden flex-1 justify-center sm:flex">
            <Stepper activeIndex={active} variant="full" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="Help"
          className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>

      {showStepper && inWizard && (
        <div className="border-t border-border bg-surface px-4 py-2 sm:hidden">
          <Stepper activeIndex={active} variant="compact" />
        </div>
      )}

      {leaveOpen && (
        <Modal onClose={() => setLeaveOpen(false)} title="Leave this report?">
          <p className="text-sm text-muted-foreground">
            Your progress will be lost.
          </p>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                setLeaveOpen(false);
                router.navigate({ to: "/" });
              }}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Leave
            </button>
            <button
              onClick={() => setLeaveOpen(false)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Stay
            </button>
          </div>
        </Modal>
      )}

      {helpOpen && (
        <Modal onClose={() => setHelpOpen(false)} title="About NorthFix">
          <ol className="space-y-2 text-sm text-foreground">
            <li><span className="font-semibold">1. Report</span> the breakdown in plain language.</li>
            <li><span className="font-semibold">2. Review</span> a likely diagnosis and safety notes.</li>
            <li><span className="font-semibold">3. Confirm</span> a parts checklist and find local suppliers.</li>
          </ol>
          <p className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
            NorthFix provides decision support only. Always follow site procedures and certified inspection before operating equipment.
          </p>
        </Modal>
      )}
    </header>
  );
}

function Stepper({
  activeIndex,
  variant,
}: {
  activeIndex: number;
  variant: "full" | "compact";
}) {
  return (
    <ol
      className="flex items-center gap-2"
      aria-label="Progress"
    >
      {STEPS.map((s, i) => {
        const state =
          i < activeIndex ? "complete" : i === activeIndex ? "active" : "upcoming";
        const isLast = i === STEPS.length - 1;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              className={[
                "grid h-6 w-6 place-items-center rounded-full text-xs font-semibold tabular",
                state === "complete" && "bg-success text-success-foreground",
                state === "active" && "bg-primary text-primary-foreground ring-2 ring-primary/20",
                state === "upcoming" && "bg-secondary text-muted-foreground",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={state === "active" ? "step" : undefined}
            >
              {state === "complete" ? "✓" : i + 1}
            </span>
            <span
              className={[
                "text-xs",
                variant === "compact" ? "hidden xs:inline" : "",
                state === "active" ? "font-semibold text-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {variant === "compact" ? s.short : s.label}
            </span>
            {!isLast && (
              <span
                className={[
                  "h-px w-6 sm:w-10",
                  i < activeIndex ? "bg-success" : "bg-border",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function Modal({
  title,
  children,
  onClose,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  accent?: "danger";
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-xl bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {accent === "danger" && (
          <div className="h-1.5 rounded-t-xl bg-destructive" />
        )}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function AppFooter({ long = false }: { long?: boolean }) {
  return (
    <footer className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
      {long ? (
        <p>
          NorthFix provides decision support only. It is not a substitute for certified inspection,
          OEM service procedures, or supervisor approval. Always follow site procedures before operating equipment.
        </p>
      ) : (
        <p>
          NorthFix provides decision support only. Always follow site procedures and certified inspection
          before operating equipment.
        </p>
      )}
    </footer>
  );
}
