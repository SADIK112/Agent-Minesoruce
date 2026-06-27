import type { DiagnosisResult, PartsResult, Supplier, ReportData } from "./types";

export async function diagnoseReal(input: ReportData): Promise<DiagnosisResult> {
  const res = await fetch("/api/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`/api/diagnose failed: ${res.status}`);
  return res.json() as Promise<DiagnosisResult>;
}

export async function getPartsReal(faultKey: string): Promise<PartsResult> {
  const res = await fetch("/api/parts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ faultKey }),
  });
  if (!res.ok) throw new Error(`/api/parts failed: ${res.status}`);
  return res.json() as Promise<PartsResult>;
}

export async function getSuppliersReal(
  categories: string[],
  lat: number,
  lng: number,
): Promise<Supplier[]> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (categories.length > 0) params.set("categories", categories.join(","));
  const res = await fetch(`/api/suppliers?${params.toString()}`);
  if (!res.ok) throw new Error(`/api/suppliers failed: ${res.status}`);
  return res.json() as Promise<Supplier[]>;
}
