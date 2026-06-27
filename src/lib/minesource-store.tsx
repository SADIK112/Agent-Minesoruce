import { createContext, useContext, useState, type ReactNode } from "react";
import type { DiagnosisResult, PartsResult, Supplier } from "./types";

export type Severity = "rough" | "stopped" | "unsafe";
export type Location = "underground" | "surface" | "shop";

export interface ReportData {
  equipment: string;
  subsystem: string;
  symptom: string;
  severity: Severity | null;
  location: Location;
}

export interface PartItem {
  id: string;
  name: string;
  qty: number;
  tier: "primary" | "related";
  checked: boolean;
}

type ScreenStatus = "idle" | "loading" | "error";

interface MineSourceState {
  report: ReportData;
  setReport: (r: Partial<ReportData>) => void;
  parts: PartItem[];
  setParts: (p: PartItem[]) => void;
  togglePart: (id: string) => void;
  resetAll: () => void;
  clearResults: () => void;
  // API result state
  diagnosis: DiagnosisResult | null;
  partsResult: PartsResult | null;
  suppliers: Supplier[] | null;
  screenStatus: Record<"diagnosis" | "parts" | "suppliers", ScreenStatus>;
  setDiagnosis: (result: DiagnosisResult) => void;
  setPartsResult: (result: PartsResult) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setScreenStatus: (screen: "diagnosis" | "parts" | "suppliers", status: ScreenStatus) => void;
}

const defaultReport: ReportData = {
  equipment: "LHD",
  subsystem: "Hydraulics",
  symptom: "",
  severity: null,
  location: "underground",
};

const Ctx = createContext<MineSourceState | null>(null);

const defaultScreenStatus: Record<"diagnosis" | "parts" | "suppliers", ScreenStatus> = {
  diagnosis: "idle",
  parts: "idle",
  suppliers: "idle",
};

export function MineSourceProvider({ children }: { children: ReactNode }) {
  const [report, setReportState] = useState<ReportData>(defaultReport);
  const [parts, setParts] = useState<PartItem[]>([]);
  const [diagnosis, setDiagnosisState] = useState<DiagnosisResult | null>(null);
  const [partsResult, setPartsResultState] = useState<PartsResult | null>(null);
  const [suppliers, setSuppliersState] = useState<Supplier[] | null>(null);
  const [screenStatus, setScreenStatusState] = useState(defaultScreenStatus);

  const setReport = (r: Partial<ReportData>) =>
    setReportState((prev) => ({ ...prev, ...r }));

  const togglePart = (id: string) =>
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)),
    );

  const resetAll = () => {
    setReportState(defaultReport);
    setParts([]);
    setDiagnosisState(null);
    setPartsResultState(null);
    setSuppliersState(null);
    setScreenStatusState(defaultScreenStatus);
  };

  const clearResults = () => {
    setDiagnosisState(null);
    setPartsResultState(null);
    setSuppliersState(null);
    setScreenStatusState(defaultScreenStatus);
  };

  const setDiagnosis = (result: DiagnosisResult) => {
    setDiagnosisState(result);
    setScreenStatusState((prev) => ({ ...prev, diagnosis: "idle" }));
  };

  const setPartsResult = (result: PartsResult) => {
    setPartsResultState(result);
    setScreenStatusState((prev) => ({ ...prev, parts: "idle" }));
  };

  const setSuppliers = (list: Supplier[]) => {
    setSuppliersState(list);
    setScreenStatusState((prev) => ({ ...prev, suppliers: "idle" }));
  };

  const setScreenStatus = (
    screen: "diagnosis" | "parts" | "suppliers",
    status: ScreenStatus,
  ) => setScreenStatusState((prev) => ({ ...prev, [screen]: status }));

  return (
    <Ctx.Provider
      value={{
        report, setReport,
        parts, setParts, togglePart,
        resetAll, clearResults,
        diagnosis, partsResult, suppliers, screenStatus,
        setDiagnosis, setPartsResult, setSuppliers, setScreenStatus,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useMineSource() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMineSource must be used within MineSourceProvider");
  return v;
}
