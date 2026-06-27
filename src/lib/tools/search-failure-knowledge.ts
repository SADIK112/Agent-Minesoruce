import { readFileSync } from "fs";
import { join } from "path";
import type { KnowledgeChunk } from "../types";

const CHUNKS_PATH = join(process.cwd(), "src/data/knowledge-chunks.json");

function loadChunks(): KnowledgeChunk[] {
  return JSON.parse(readFileSync(CHUNKS_PATH, "utf-8")) as KnowledgeChunk[];
}

function score(chunk: KnowledgeChunk, queryWords: string[]): number {
  const text = chunk.text.toLowerCase();
  return queryWords.reduce(
    (total, word) => (text.includes(word) ? total + 1 : total),
    0
  );
}

export function searchFailureKnowledge(
  query: string,
  topN: number = 5
): KnowledgeChunk[] {
  const chunks = loadChunks();
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = chunks
    .map((chunk) => ({ chunk, score: score(chunk, queryWords) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.chunk);

  return scored.length > 0 ? scored : chunks.slice(0, 3);
}
