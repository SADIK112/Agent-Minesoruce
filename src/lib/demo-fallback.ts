import type { DiagnosisResult } from "./types";

export const DEMO_FALLBACK: DiagnosisResult = {
  faults: [
    {
      key: "hose-burst",
      description:
        "High-pressure hydraulic hose rupture detected. Sudden loss of system pressure consistent with a burst main boom hose or fitting blowout. Fluid ejection risk — inspect for oil on hot surfaces before approaching.",
      confidence: 0.91,
      safetyCritical: true,
    },
  ],
  summary:
    "The reported symptoms — sudden loss of boom and bucket pressure accompanied by visible fluid spray — are consistent with a high-pressure hydraulic hose burst. This is the most common hydraulic failure on LHD equipment. Stop work immediately, lower the bucket if possible, shut down the machine, and assess for fire risk before the mechanic approaches. Replace the failed hose with one of matching bore and pressure rating. Flush and inspect the system for secondary contamination.",
  safetyCritical: true,
};
