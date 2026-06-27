import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { KnowledgeChunk } from "../src/lib/types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHUNK_SIZE = 150;
const OVERLAP = 25;

const FAULT_KEY_HEADINGS: Record<string, string | undefined> = {
  "hose burst": "hose-burst",
  "hose-burst": "hose-burst",
  "pump failure": "pump-failure",
  "pump-failure": "pump-failure",
  "cylinder seal": "cylinder-leak",
  "cylinder-leak": "cylinder-leak",
  "steering system": "steering-loss",
  "steering-loss": "steering-loss",
  "steering loss": "steering-loss",
  "low system pressure": "low-pressure",
  "low-pressure": "low-pressure",
  "fluid contamination": "contamination",
  "contamination": "contamination",
  "control valve": "valve-stuck",
  "valve-stuck": "valve-stuck",
  "filter blockage": "filter-blocked",
  "filter-blocked": "filter-blocked",
  "brake system": "brake-fade",
  "brake-fade": "brake-fade",
  "oil overheating": "cooling-fault",
  "cooling-fault": "cooling-fault",
  "general underground": undefined,
};

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function faultKeyFromHeading(heading: string): string | undefined {
  const lower = heading.toLowerCase();
  for (const [pattern, key] of Object.entries(FAULT_KEY_HEADINGS)) {
    if (lower.includes(pattern)) return key ?? undefined;
  }
  return undefined;
}

interface Section {
  faultKey?: string;
  text: string;
}

function parseSections(raw: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { text: "" };

  for (const line of raw.split("\n")) {
    if (line.startsWith("## ") || line.startsWith("### ")) {
      if (current.text.trim()) sections.push(current);
      const heading = line.replace(/^#{2,3}\s+/, "");
      current = { faultKey: faultKeyFromHeading(heading), text: "" };
    } else if (!line.startsWith("### faultKey:")) {
      current.text += " " + line;
    }
  }
  if (current.text.trim()) sections.push(current);

  return sections;
}

function chunkSection(section: Section, startNum: number): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const words = tokenize(section.text);
  let index = 0;
  let num = startNum;

  while (index < words.length) {
    const slice = words.slice(index, index + CHUNK_SIZE);
    if (slice.length < 20) break; // skip tiny trailing fragments

    const id = `chunk-${String(num).padStart(3, "0")}`;
    chunks.push({
      id,
      text: slice.join(" "),
      subsystem: "hydraulics",
      ...(section.faultKey ? { faultKey: section.faultKey } : {}),
    });

    num++;
    index += CHUNK_SIZE - OVERLAP;
    if (slice.length < CHUNK_SIZE) break;
  }

  return chunks;
}

function main() {
  const srcPath = join(__dirname, "raw-knowledge.md");
  const outPath = join(__dirname, "../src/data/knowledge-chunks.json");

  const raw = readFileSync(srcPath, "utf-8");
  const sections = parseSections(raw);

  const allChunks: KnowledgeChunk[] = [];
  let chunkNum = 1;

  for (const section of sections) {
    const chunks = chunkSection(section, chunkNum);
    allChunks.push(...chunks);
    chunkNum += chunks.length;
  }

  writeFileSync(outPath, JSON.stringify(allChunks, null, 2));

  console.log(`✓ Generated ${allChunks.length} chunks → ${outPath}`);
  allChunks.forEach((c) => {
    const tag = c.faultKey ? ` [${c.faultKey}]` : "";
    console.log(`  ${c.id}${tag}: ${tokenize(c.text).length} words`);
  });
}

main();
