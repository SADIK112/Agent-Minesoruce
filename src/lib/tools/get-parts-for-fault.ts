import { readFileSync } from "fs";
import { join } from "path";
import type { PartsResult } from "../types";

const DATA_PATH = join(process.cwd(), "src/data/failure_to_parts.json");

interface FailureEntry {
  faultKey: string;
  primaryParts: string[];
  relatedParts: string[];
}

function loadData(): FailureEntry[] {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8")) as FailureEntry[];
}

export function getPartsForFault(faultKey: string): PartsResult {
  const entries = loadData();
  const match = entries.find((e) => e.faultKey === faultKey);

  return {
    faultKey,
    primaryParts: match?.primaryParts ?? [],
    relatedParts: match?.relatedParts ?? [],
  };
}
