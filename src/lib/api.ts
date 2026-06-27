import type { DiagnosisResult, ReportData } from "./types";

export {
  diagnoseMock as diagnose,
  getPartsMock as getParts,
  getSuppliersMock as getSuppliers,
} from "./api-mock";

/** Sudbury city centre — default when geolocation is unavailable. */
export const SUDBURY_CENTER = { lat: 46.4917, lng: -80.9930 };

/** Used when both diagnose attempts fail — matches Dev 1 demo-fallback spec. */
export const DEMO_FALLBACK: DiagnosisResult = {
  faults: [
    {
      key: "hose-burst",
      description: "High-pressure hydraulic hose failure",
      confidence: 0.91,
      safetyCritical: true,
    },
  ],
  summary:
    "A high-pressure hydraulic hose has likely failed or is leaking at a fitting. Fluid loss can cause loss of lift and brake function — treat as safety-critical until inspected.",
  safetyCritical: true,
};

/** Maps wizard report fields to the API diagnose request body. */
export function toDiagnoseInput(report: {
  symptom: string;
  severity: "rough" | "stopped" | "unsafe" | null;
  location: "underground" | "surface" | "shop";
}): ReportData {
  const severityMap = {
    rough: "low",
    stopped: "high",
    unsafe: "critical",
  } as const;

  const locationMap = {
    underground: "underground",
    surface: "surface",
    shop: "surface",
  } as const;

  return {
    description: report.symptom.trim(),
    severity: report.severity ? severityMap[report.severity] : "medium",
    location: locationMap[report.location],
  };
}
