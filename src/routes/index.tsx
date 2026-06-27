import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Search, Wrench, MapPin, ShieldAlert, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Modal, AppFooter } from "@/components/minesource/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agent MineSource — Field maintenance copilot for LHD hydraulics" },
      { name: "description", content: "Report a breakdown. Get a diagnosis, parts list, and local Sudbury suppliers — in minutes, on your phone." },
      { property: "og:title", content: "Agent MineSource — Field maintenance copilot" },
      { property: "og:description", content: "Report a breakdown. Get a diagnosis, parts list, and local Sudbury suppliers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-primary">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight">Agent MineSource</span>
        </div>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="Help"
          className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:max-w-lg">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          For LHD hydraulics · Sudbury
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Agent MineSource
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Report a breakdown. Get a diagnosis, parts list, and local suppliers.
        </p>

        <Link
          to="/report"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 active:scale-[0.99] sm:w-auto sm:min-w-[280px]"
        >
          Report an issue
        </Link>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Chip icon={<Search className="h-3.5 w-3.5" />} label="Diagnosis" />
          <Chip icon={<Wrench className="h-3.5 w-3.5" />} label="Parts" />
          <Chip icon={<MapPin className="h-3.5 w-3.5" />} label="Local" />
        </ul>

        <div className="mt-12 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
          <Step n={1} icon={<ClipboardList className="h-4 w-4" />} title="Report" body="Describe the breakdown in plain language." />
          <Step n={2} icon={<Search className="h-4 w-4" />} title="Diagnose" body="See likely faults and safety notes." />
          <Step n={3} icon={<Wrench className="h-4 w-4" />} title="Parts & suppliers" body="Get a checklist and call local shops." />
        </div>
      </main>

      <AppFooter long />

      {helpOpen && (
        <Modal onClose={() => setHelpOpen(false)} title="About Agent MineSource">
          <ol className="space-y-2 text-sm text-foreground">
            <li><span className="font-semibold">1. Report</span> the breakdown in plain language.</li>
            <li><span className="font-semibold">2. Review</span> a likely diagnosis and safety notes.</li>
            <li><span className="font-semibold">3. Confirm</span> a parts checklist and find local suppliers.</li>
          </ol>
          <p className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
            Agent MineSource provides decision support only. Always follow site procedures and certified inspection before operating equipment.
          </p>
        </Modal>
      )}
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
      <span className="text-accent">{icon}</span>
      {label}
    </li>
  );
}

function Step({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-primary">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-xs font-bold">{n}</span>
        <span className="text-accent">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
