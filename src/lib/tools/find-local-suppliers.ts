import { readFileSync } from "fs";
import { join } from "path";
import type { Supplier } from "../types";
import { haversineDistance } from "../haversine";

const DATA_PATH = join(process.cwd(), "src/data/sudbury_suppliers.json");

interface RawAddress {
  formatted?: string;
  street?: string;
  city?: string;
  province?: string;
}

interface RawLocation {
  lat: number;
  lon: number;
}

interface RawSupplier {
  id: string;
  name: string;
  phone: string | null;
  website: string;
  address: RawAddress | string;
  location: RawLocation;
  productCategories?: string[];
  categories?: string[];
}

interface RawFile {
  suppliers?: RawSupplier[];
}

function normalize(raw: RawSupplier): Supplier {
  const address =
    typeof raw.address === "string"
      ? raw.address
      : raw.address.formatted ??
        [raw.address.street, raw.address.city, raw.address.province]
          .filter(Boolean)
          .join(", ");

  return {
    id: raw.id,
    name: raw.name,
    address,
    phone: raw.phone ?? "",
    website: raw.website ?? "",
    lat: raw.location.lat,
    lng: raw.location.lon,
    categories: raw.productCategories ?? raw.categories ?? [],
  };
}

function loadSuppliers(): Supplier[] {
  const raw = JSON.parse(readFileSync(DATA_PATH, "utf-8")) as
    | RawFile
    | RawSupplier[];
  const list = Array.isArray(raw) ? raw : (raw.suppliers ?? []);
  return list.map(normalize);
}

function hasOverlap(supplierCategories: string[], requested: string[]): boolean {
  if (requested.length === 0) return false;
  const requestedWords = requested
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  return supplierCategories.some((cat) => {
    const catLower = cat.toLowerCase();
    return requestedWords.some((word) => catLower.includes(word));
  });
}

export function findLocalSuppliers(
  categories: string[],
  lat: number,
  lng: number
): Supplier[] {
  const suppliers = loadSuppliers();

  const withDistance = suppliers.map((s) => ({
    supplier: s,
    distance: haversineDistance(lat, lng, s.lat, s.lng),
  }));

  const matched =
    categories.length === 0
      ? withDistance
      : withDistance.filter(({ supplier }) =>
          hasOverlap(supplier.categories, categories)
        );

  const ranked = (matched.length > 0 ? matched : withDistance).sort(
    (a, b) => a.distance - b.distance
  );

  return ranked.map(({ supplier }) => supplier);
}
