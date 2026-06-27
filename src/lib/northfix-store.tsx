import { createContext, useContext, useState, type ReactNode } from "react";

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

interface NorthFixState {
  report: ReportData;
  setReport: (r: Partial<ReportData>) => void;
  parts: PartItem[];
  setParts: (p: PartItem[]) => void;
  togglePart: (id: string) => void;
  resetAll: () => void;
}

const defaultReport: ReportData = {
  equipment: "LHD",
  subsystem: "Hydraulics",
  symptom: "",
  severity: null,
  location: "underground",
};

const Ctx = createContext<NorthFixState | null>(null);

export function NorthFixProvider({ children }: { children: ReactNode }) {
  const [report, setReportState] = useState<ReportData>(defaultReport);
  const [parts, setParts] = useState<PartItem[]>([]);

  const setReport = (r: Partial<ReportData>) =>
    setReportState((prev) => ({ ...prev, ...r }));

  const togglePart = (id: string) =>
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)),
    );

  const resetAll = () => {
    setReportState(defaultReport);
    setParts([]);
  };

  return (
    <Ctx.Provider value={{ report, setReport, parts, setParts, togglePart, resetAll }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNorthFix() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNorthFix must be used within NorthFixProvider");
  return v;
}
