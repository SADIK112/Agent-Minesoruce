import { generateText, tool, isLoopFinished } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { searchFailureKnowledge } from "./tools/search-failure-knowledge";
import { DiagnosisResultSchema } from "./schemas";
import { DEMO_FALLBACK } from "./demo-fallback";
import type { DiagnosisResult } from "./types";

const SYSTEM_PROMPT = `You are a hydraulic fault diagnosis assistant for underground LHD (Load-Haul-Dump) mining equipment.

A maintenance worker has reported a breakdown. Your job is to:
1. Call the search_failure_knowledge tool with a query based on the reported symptoms to retrieve relevant technical knowledge.
2. Use the retrieved knowledge to identify the most likely hydraulic fault(s).
3. Respond with ONLY a valid JSON object — no other text, no markdown, no explanation.

The JSON must match this exact shape:
{
  "faults": [
    {
      "key": "<one of: hose-burst | pump-failure | cylinder-leak | steering-loss | low-pressure | contamination | valve-stuck | filter-blocked | brake-fade | cooling-fault>",
      "description": "<plain-language description of this specific fault based on the reported symptoms>",
      "confidence": <float 0.0–1.0>,
      "safetyCritical": <true if fault involves brakes, steering, fire risk, or loss of machine control — otherwise false>
    }
  ],
  "summary": "<one paragraph plain-language diagnosis summary for a maintenance worker>",
  "safetyCritical": <true if ANY fault in the array is safetyCritical — otherwise false>
}

Rules:
- List 1–3 faults, ordered by confidence descending.
- Confidence must reflect genuine uncertainty — do not set all faults to 1.0.
- Set safetyCritical: true on any fault involving brake failure, steering loss, fire risk, or loss of machine control.
- The top-level safetyCritical must be true if any individual fault is safetyCritical.
- Respond with ONLY the JSON object. No other text.`;

export async function runDiagnosisAgent(
  description: string,
  severity: string,
  location: string
): Promise<DiagnosisResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt: `Equipment: LHD (underground loader)
Subsystem: Hydraulics
Severity: ${severity}
Location: ${location}
Operator report: ${description}`,
      abortSignal: controller.signal,
      stopWhen: isLoopFinished(),
      tools: {
        search_failure_knowledge: tool({
          description:
            "Search the hydraulic failure knowledge base for information relevant to the reported symptoms. Call this before forming your diagnosis.",
          inputSchema: z.object({
            query: z
              .string()
              .describe(
                "Keywords describing the symptoms — e.g. 'hose burst pressure loss bucket drop'"
              ),
          }),
          execute: async ({ query }) => {
            const chunks = searchFailureKnowledge(query, 5);
            return chunks.map((c) => c.text).join("\n\n");
          },
        }),
      },
    });

    const json = JSON.parse(text.trim());
    return DiagnosisResultSchema.parse(json);
  } catch {
    return DEMO_FALLBACK;
  } finally {
    clearTimeout(timeout);
  }
}
