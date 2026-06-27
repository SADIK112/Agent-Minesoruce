import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

type ScreenName = "diagnosis" | "parts" | "suppliers";
type ScreenStatus = "idle" | "loading" | "error";

type ScreenStatusMap = Record<ScreenName, ScreenStatus>;

interface MineSourceState {
  report: ReportData;
  setReport: (r: Partial<ReportData>) => void;
  /** Legacy checklist state — used by parts.tsx until feature 04 rewires the screen. */
  parts: PartItem[];
  setParts: (p: PartItem[]) => void;
  togglePart: (id: string) => void;
  diagnosis: DiagnosisResult | null;
  setDiagnosis: (result: DiagnosisResult) => void;
  /** API parts result — spec name `parts`; aliased to avoid conflict with legacy checklist. */
  partsResult: PartsResult | null;
  setPartsResult: (result: PartsResult) => void;
  suppliers: Supplier[] | null;
  setSuppliers: (suppliers: Supplier[]) => void;
  screenStatus: ScreenStatusMap;
  setScreenStatus: (screen: ScreenName, status: ScreenStatus) => void;
  resetAll: () => void;
}

const defaultReport: ReportData = {
  equipment: "LHD",
  subsystem: "Hydraulics",
  symptom: "",
  severity: null,
  location: "underground",
};

const defaultScreenStatus: ScreenStatusMap = {
  diagnosis: "idle",
  parts: "idle",
  suppliers: "idle",
};

const Ctx = createContext<MineSourceState | null>(null);

export function MineSourceProvider({ children }: { children: ReactNode }) {
  const [report, setReportState] = useState<ReportData>(defaultReport);
  const [parts, setPartsState] = useState<PartItem[]>([]);
  const [diagnosis, setDiagnosisState] = useState<DiagnosisResult | null>(null);
  const [partsResult, setPartsResultState] = useState<PartsResult | null>(null);
  const [suppliers, setSuppliersState] = useState<Supplier[] | null>(null);
  const [screenStatus, setScreenStatusState] = useState<ScreenStatusMap>(defaultScreenStatus);

  const setReport = useCallback(
    (r: Partial<ReportData>) => setReportState((prev) => ({ ...prev, ...r })),
    [],
  );

  const setParts = useCallback((p: PartItem[]) => setPartsState(p), []);

  const togglePart = useCallback(
    (id: string) =>
      setPartsState((prev) =>
        prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)),
      ),
    [],
  );

  const setDiagnosis = useCallback((result: DiagnosisResult) => {
    setDiagnosisState(result);
    setScreenStatusState((prev) => ({ ...prev, diagnosis: "idle" }));
  }, []);

  const setPartsResult = useCallback((result: PartsResult) => {
    setPartsResultState(result);
    setScreenStatusState((prev) => ({ ...prev, parts: "idle" }));
  }, []);

  const setSuppliers = useCallback((next: Supplier[]) => {
    setSuppliersState(next);
    setScreenStatusState((prev) => ({ ...prev, suppliers: "idle" }));
  }, []);

  const setScreenStatus = useCallback((screen: ScreenName, status: ScreenStatus) => {
    setScreenStatusState((prev) => ({ ...prev, [screen]: status }));
  }, []);

  const resetAll = useCallback(() => {
    setReportState(defaultReport);
    setPartsState([]);
    setDiagnosisState(null);
    setPartsResultState(null);
    setSuppliersState(null);
    setScreenStatusState(defaultScreenStatus);
  }, []);

  const value = useMemo(
    () => ({
      report,
      setReport,
      parts,
      setParts,
      togglePart,
      diagnosis,
      setDiagnosis,
      partsResult,
      setPartsResult,
      suppliers,
      setSuppliers,
      screenStatus,
      setScreenStatus,
      resetAll,
    }),
    [
      report,
      parts,
      diagnosis,
      partsResult,
      suppliers,
      screenStatus,
      setReport,
      setParts,
      togglePart,
      setDiagnosis,
      setPartsResult,
      setSuppliers,
      setScreenStatus,
      resetAll,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMineSource() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMineSource must be used within MineSourceProvider");
  return v;
}
