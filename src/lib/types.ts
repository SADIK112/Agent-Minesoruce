export interface ReportData {
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location: "surface" | "underground" | "ramp" | "shaft";
}

export interface FaultEntry {
  key: string;
  description: string;
  confidence: number;
  safetyCritical: boolean;
}

export interface DiagnosisResult {
  faults: FaultEntry[];
  summary: string;
  safetyCritical: boolean;
}

export interface PartsResult {
  faultKey: string;
  primaryParts: string[];
  relatedParts: string[];
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  lat: number;
  lng: number;
  categories: string[];
}

export interface KnowledgeChunk {
  id: string;
  text: string;
  subsystem: string;
  faultKey?: string;
}
