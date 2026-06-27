import type { DiagnosisResult, PartsResult, Supplier, ReportData } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const MOCK_DIAGNOSIS: DiagnosisResult = {
  faults: [
    {
      key: "hose-burst",
      description:
        "High-pressure hydraulic hose rupture on the boom lift circuit. Loss of hydraulic fluid causing bucket drop and pressure loss.",
      confidence: 0.91,
      safetyCritical: true,
    },
    {
      key: "low-pressure",
      description:
        "System-wide hydraulic pressure drop as a secondary effect of the hose burst.",
      confidence: 0.65,
      safetyCritical: false,
    },
  ],
  summary:
    "The reported symptoms are consistent with a high-pressure hydraulic hose burst on the boom lift circuit. The sudden fluid loss explains the bucket drop and loss of steering assist. Machine must be shut down immediately and inspected before returning to service.",
  safetyCritical: true,
};

const MOCK_PARTS: PartsResult = {
  faultKey: "hose-burst",
  primaryParts: [
    "High-pressure hydraulic hose assembly (2-wire braid, 3/4 inch)",
    "Hydraulic hose end fittings (JIC 37° flare)",
    "Hose clamps and mounting brackets",
  ],
  relatedParts: [
    "Hydraulic fluid (ISO 46 or OEM specified grade)",
    "Hydraulic filter element",
    "O-ring seal kit",
    "Hydraulic quick-disconnect couplings",
  ],
};

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "nelmaco-eastern",
    name: "Nelmaco Eastern",
    address: "1935 Paris St, Sudbury, ON P3E 3C9",
    phone: "(705) 522-3000",
    website: "https://www.nelmaco.com",
    lat: 46.5373,
    lng: -80.9201,
    categories: ["hydraulic hose", "fittings", "industrial supplies"],
  },
  {
    id: "sudbury-mining-products",
    name: "Sudbury Mining Products",
    address: "162 Fielding Rd, Lively, ON P3Y 1L7",
    phone: "(705) 692-3444",
    website: "https://www.sudburyminingproducts.com",
    lat: 46.5289,
    lng: -80.9127,
    categories: ["mining equipment", "hydraulic components", "seals"],
  },
  {
    id: "lopes-limited",
    name: "Lopes Limited",
    address: "3440 Falconbridge Hwy, Sudbury, ON P3A 4S4",
    phone: "(705) 566-8100",
    website: "https://www.lopeslimited.com",
    lat: 46.4806,
    lng: -80.8445,
    categories: ["hydraulic systems", "industrial hose", "fluid power"],
  },
];

export async function diagnoseMock(_input: ReportData): Promise<DiagnosisResult> {
  await delay(500);
  return MOCK_DIAGNOSIS;
}

export async function getPartsMock(_faultKey: string): Promise<PartsResult> {
  await delay(500);
  return MOCK_PARTS;
}

export async function getSuppliersMock(
  _categories: string[],
  _lat: number,
  _lng: number,
): Promise<Supplier[]> {
  await delay(500);
  return MOCK_SUPPLIERS;
}
