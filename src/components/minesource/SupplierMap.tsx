import { useEffect, useState, type ReactNode } from "react";

import type { Supplier } from "@/lib/types";

export interface SupplierMapProps {
  suppliers: Supplier[];
  center: { lat: number; lng: number };
}

const PLACEHOLDER_CLASS =
  "aspect-[16/11] w-full rounded-xl border border-border bg-secondary/60";

function MapPlaceholder() {
  return <div className={PLACEHOLDER_CLASS} aria-hidden="true" />;
}

function formatTelHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `tel:${digits}` : "#";
}

export function SupplierMap({ suppliers, center }: SupplierMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MapPlaceholder />;
  }

  return <SupplierMapClient suppliers={suppliers} center={center} />;
}

function SupplierMapClient({ suppliers, center }: SupplierMapProps) {
  const [mapUi, setMapUi] = useState<ReactNode>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      await import("leaflet/dist/leaflet.css");
      const [leafletMod, reactLeafletMod] = await Promise.all([
        import("leaflet"),
        import("react-leaflet"),
      ]);

      if (cancelled) return;

      const L = leafletMod.default;
      const { MapContainer, TileLayer, Marker, Popup, useMap } = reactLeafletMod;

      configureDefaultMarkerIcon(L);

      function FitSuppliersBounds({ items }: { items: Supplier[] }) {
        const map = useMap();

        useEffect(() => {
          if (items.length === 0) return;
          const bounds = L.latLngBounds(items.map((s) => [s.lat, s.lng] as [number, number]));
          map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
        }, [map, items]);

        return null;
      }

      setMapUi(
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={11}
          className="z-0 h-full w-full rounded-xl"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitSuppliersBounds items={suppliers} />
          {suppliers.map((supplier) => (
            <Marker key={supplier.id} position={[supplier.lat, supplier.lng]}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">{supplier.name}</p>
                  <p className="text-muted-foreground">{supplier.address}</p>
                  <a
                    href={formatTelHref(supplier.phone)}
                    className="inline-block font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {supplier.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>,
      );
    }

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, [suppliers, center.lat, center.lng]);

  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
      {mapUi ?? <MapPlaceholder />}
      <div className="pointer-events-none absolute bottom-2 right-2 z-[1000] rounded-md bg-surface/90 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
        Greater Sudbury
      </div>
    </div>
  );
}

function configureDefaultMarkerIcon(L: typeof import("leaflet")) {
  // Vite does not resolve Leaflet's default icon asset paths automatically.
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
    iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
    shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
  });
}
