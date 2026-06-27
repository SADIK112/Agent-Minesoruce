import { useEffect, useState } from "react";
import type { Supplier } from "@/lib/types";

interface Props {
  suppliers: Supplier[];
  center: { lat: number; lng: number };
}

// Leaflet touches `window` at import time — only load it client-side.
export function SupplierMap({ suppliers, center }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="aspect-[16/11] w-full rounded-xl border border-border bg-secondary/60" />
    );
  }

  return <LeafletMap suppliers={suppliers} center={center} />;
}

function LeafletMap({ suppliers, center }: Props) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [Components, setComponents] = useState<{
    MapContainer: typeof import("react-leaflet")["MapContainer"];
    TileLayer: typeof import("react-leaflet")["TileLayer"];
    Marker: typeof import("react-leaflet")["Marker"];
    Popup: typeof import("react-leaflet")["Popup"];
  } | null>(null);

  useEffect(() => {
    async function load() {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      const rl = await import("react-leaflet");

      // Fix default marker icon paths broken by bundlers
      const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
      const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
      const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
      leaflet.default.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

      setL(leaflet.default);
      setComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
      });
    }
    load();
  }, []);

  if (!L || !Components) {
    return (
      <div className="aspect-[16/11] w-full rounded-xl border border-border bg-secondary/60" />
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = Components;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      className="aspect-[16/11] w-full rounded-xl border border-border"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {suppliers.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]}>
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold">{s.name}</p>
              <p className="mt-1 text-xs text-gray-600">{s.address}</p>
              {s.phone && (
                <a
                  href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-2 block text-sm font-medium text-blue-600 hover:underline"
                >
                  {s.phone}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
