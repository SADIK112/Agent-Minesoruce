import type { DiagnosisResult, PartsResult, ReportData, Supplier } from "./types";

const MOCK_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const HOSE_BURST_DIAGNOSIS: DiagnosisResult = {
  faults: [
    {
      key: "hose-burst",
      description: "Hydraulic hose abrasion / fitting leak",
      confidence: 0.72,
      safetyCritical: false,
    },
    {
      key: "cylinder-seal-failure",
      description: "Cylinder seal failure",
      confidence: 0.18,
      safetyCritical: false,
    },
    {
      key: "hydraulic-fluid-contamination",
      description: "Hydraulic fluid contamination",
      confidence: 0.1,
      safetyCritical: false,
    },
  ],
  summary:
    "Symptoms suggest a high-pressure hose has chafed against the boom or a JIC fitting is weeping. Fluid loss combined with sluggish lift response is consistent with leak-driven pressure drop rather than pump or cylinder failure.",
  safetyCritical: false,
};

const HOSE_BURST_PARTS: PartsResult = {
  faultKey: "hose-burst",
  primaryParts: [
    "High-pressure hydraulic hose assembly",
    "Hydraulic fittings (JIC / flange)",
    "Hydraulic fluid (top-up)",
  ],
  relatedParts: [
    "Hydraulic return filter element",
    "Hose clamps / chafe sleeve",
    "O-ring kit (assorted)",
  ],
};

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "nelmaco-eastern",
    name: "Nelmaco Eastern Ltd",
    address: "2853 Fielding Dr, Lively, ON P3Y 1K7",
    phone: "(705) 692-2171",
    website: "https://www.nelmaco.com",
    lat: 46.4489,
    lng: -81.1489,
    categories: [
      "High-pressure hydraulic hose assembly",
      "Hydraulic fittings (JIC / flange)",
      "Hydraulic pump and motor rebuild",
    ],
  },
  {
    id: "motion-industries-sudbury",
    name: "Motion Industries",
    address: "1321 Notre Dame Ave, Sudbury, ON P3A 2T3",
    phone: "(705) 673-6611",
    website: "https://www.motionindustries.com",
    lat: 46.5134,
    lng: -80.9948,
    categories: [
      "Hydraulic fittings (JIC / flange)",
      "Heavy equipment filters",
      "Hydraulic fluid (top-up)",
    ],
  },
  {
    id: "finning-sudbury",
    name: "Finning Canada",
    address: "2600 Regent St, Sudbury, ON P3E 5R8",
    phone: "(705) 673-6600",
    website: "https://www.finning.com",
    lat: 46.4782,
    lng: -80.9681,
    categories: [
      "High-pressure hydraulic hose assembly",
      "Hydraulic pump and motor rebuild",
      "Hose clamps / chafe sleeve",
    ],
  },
];

export async function diagnoseMock(_input: ReportData): Promise<DiagnosisResult> {
  await delay(MOCK_DELAY_MS);
  return HOSE_BURST_DIAGNOSIS;
}

export async function getPartsMock(faultKey: string): Promise<PartsResult> {
  await delay(MOCK_DELAY_MS);
  if (faultKey === "hose-burst") {
    return HOSE_BURST_PARTS;
  }
  return { faultKey, primaryParts: [], relatedParts: [] };
}

export async function getSuppliersMock(
  _categories: string[],
  _lat: number,
  _lng: number,
): Promise<Supplier[]> {
  await delay(MOCK_DELAY_MS);
  return MOCK_SUPPLIERS;
}
