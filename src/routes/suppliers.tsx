import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Phone, ExternalLink, MapPin, Check } from "lucide-react";
import { AppHeader, AppFooter } from "@/components/minesource/AppShell";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Local suppliers · Agent MineSource" },
      { name: "description", content: "Nearby Sudbury suppliers for hydraulic parts — sorted by best match and nearest distance." },
    ],
  }),
  component: SuppliersPage,
});

interface Supplier {
  id: string;
  name: string;
  distanceKm: number;
  tags: string[];
  phone: string;
  website: string;
  hours: string;
  openNow: boolean;
  // map position as a percentage within the SVG viewport
  x: number;
  y: number;
}

const SUPPLIERS: Supplier[] = [
  {
    id: "nelmaco",
    name: "Nelmaco Eastern Ltd",
    distanceKm: 4.2,
    tags: ["hydraulics", "winches", "hoists"],
    phone: "(705) 555-0142",
    website: "https://example.com/nelmaco",
    hours: "Mon–Fri 8:00–16:00",
    openNow: true,
    x: 42,
    y: 38,
  },
  {
    id: "sudbury-mining",
    name: "Sudbury Mining Products",
    distanceKm: 5.1,
    tags: ["pumps", "hydraulics", "fittings"],
    phone: "(705) 555-0188",
    website: "https://example.com/sudbury-mining",
    hours: "Mon–Sat 7:00–17:00",
    openNow: true,
    x: 60,
    y: 52,
  },
  {
    id: "lopes",
    name: "Lopes Limited",
    distanceKm: 6.8,
    tags: ["fabrication", "industrial supplies"],
    phone: "(705) 555-0163",
    website: "https://example.com/lopes",
    hours: "Mon–Fri 8:00–17:00",
    openNow: false,
    x: 32,
    y: 66,
  },
];

function SuppliersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [pinBounce, setPinBounce] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(id);
  }, []);

  const onPinClick = (id: string) => {
    setHighlight(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlight(null), 1200);
  };

  const onCardClick = (id: string) => {
    setPinBounce(id);
    setTimeout(() => setPinBounce(null), 600);
  };

  const onDone = () => {
    setToast("Report complete");
    setTimeout(() => router.navigate({ to: "/" }), 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Local suppliers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Finding suppliers near Sudbury…" : "Sorted by best match and nearest distance"}
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Map */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MapPanel
              loading={loading}
              highlight={highlight}
              bounce={pinBounce}
              onPinClick={onPinClick}
            />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-secondary/60" />
                ))
              : SUPPLIERS.map((s, i) => (
                  <SupplierCard
                    key={s.id}
                    ref={(el) => {
                      cardRefs.current[s.id] = el;
                    }}
                    supplier={s}
                    rank={i + 1}
                    highlighted={highlight === s.id}
                    onClick={() => onCardClick(s.id)}
                  />
                ))}
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 sm:backdrop-blur-none">
        <div className="mx-auto flex w-full max-w-5xl justify-end">
          <button
            type="button"
            onClick={onDone}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:opacity-95 sm:w-auto sm:min-w-[240px]"
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

function MapPanel({
  loading,
  highlight,
  bounce,
  onPinClick,
}: {
  loading: boolean;
  highlight: string | null;
  bounce: string | null;
  onPinClick: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="aspect-[16/11] w-full animate-pulse rounded-xl border border-border bg-secondary/60" />
    );
  }
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
      {/* Stylized map backdrop */}
      <svg viewBox="0 0 400 275" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
          </pattern>
        </defs>
        <rect width="400" height="275" fill="url(#grid)" />
        {/* "Roads" */}
        <path d="M0,150 Q120,140 200,160 T400,140" stroke="oklch(0.85 0.01 250)" strokeWidth="6" fill="none" />
        <path d="M180,0 Q200,120 220,275" stroke="oklch(0.85 0.01 250)" strokeWidth="5" fill="none" />
        <path d="M40,30 L380,250" stroke="oklch(0.9 0.01 250)" strokeWidth="3" fill="none" />
        {/* "Lake" */}
        <ellipse cx="80" cy="220" rx="60" ry="28" fill="oklch(0.86 0.04 235)" opacity="0.6" />
        <text x="80" y="225" textAnchor="middle" className="fill-muted-foreground" fontSize="9">
          Ramsey Lake
        </text>
      </svg>

      {/* Pins */}
      {SUPPLIERS.map((s, i) => {
        const isHi = highlight === s.id;
        const isBounce = bounce === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPinClick(s.id)}
            aria-label={`Supplier ${i + 1}: ${s.name}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className={[
              "absolute -translate-x-1/2 -translate-y-full transition-transform",
              isBounce ? "animate-bounce" : "",
            ].join(" ")}
          >
            <div
              className={[
                "grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold tabular shadow-md transition",
                isHi
                  ? "border-accent bg-accent text-accent-foreground scale-110"
                  : "border-primary-foreground bg-primary text-primary-foreground",
              ].join(" ")}
            >
              {i + 1}
            </div>
            <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 bg-primary" />
          </button>
        );
      })}

      <div className="absolute bottom-2 right-2 rounded-md bg-surface/90 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
        Greater Sudbury
      </div>
    </div>
  );
}

interface CardProps {
  supplier: Supplier;
  rank: number;
  highlighted: boolean;
  onClick: () => void;
}

const SupplierCard = (() => {
  const C = ({ supplier: s, rank, highlighted, onClick, ref }: CardProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      onClick={onClick}
      className={[
        "cursor-pointer rounded-xl border bg-surface p-4 shadow-sm transition",
        highlighted ? "border-primary ring-2 ring-primary/20" : "border-border hover:shadow-md",
      ].join(" ")}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold tabular text-primary-foreground">
          {rank}
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-base font-bold text-foreground">{s.name}</h3>
            <span className="shrink-0 inline-flex items-center gap-1 text-xs tabular text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {s.distanceKm} km
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Likely carries:</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {s.tags.map((t) => (
              <li key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{s.hours}</span>
            {s.openNow ? (
              <span className="inline-flex items-center gap-1 font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Open now
              </span>
            ) : (
              <span className="text-muted-foreground/80">Closed</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`tel:${s.phone.replace(/[^\d]/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              <Phone className="h-4 w-4" />
              {s.phone}
            </a>
            <a
              href={s.website}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  return C;
})();
