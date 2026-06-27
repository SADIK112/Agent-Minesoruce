import type { DiagnosisResult, PartsResult, ReportData, Supplier } from "./types";

export async function diagnoseReal(input: ReportData): Promise<DiagnosisResult> {
  const response = await fetch("/api/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Diagnose request failed: ${response.status}`);
  }
  return response.json() as Promise<DiagnosisResult>;
}

export async function getPartsReal(faultKey: string): Promise<PartsResult> {
  const response = await fetch("/api/parts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ faultKey }),
  });
  if (!response.ok) {
    throw new Error(`Parts request failed: ${response.status}`);
  }
  return response.json() as Promise<PartsResult>;
}

export async function getSuppliersReal(
  categories: string[],
  lat: number,
  lng: number,
): Promise<Supplier[]> {
  const params = new URLSearchParams({
    categories: categories.join(","),
    lat: String(lat),
    lng: String(lng),
  });
  const response = await fetch(`/api/suppliers?${params}`);
  if (!response.ok) {
    throw new Error(`Suppliers request failed: ${response.status}`);
  }
  return response.json() as Promise<Supplier[]>;
}
