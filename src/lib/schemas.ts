import { z } from "zod";

export const DiagnoseInputSchema = z.object({
  description: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"]),
  location: z.enum(["surface", "underground", "ramp", "shaft"]),
});

export const FaultEntrySchema = z.object({
  key: z.string().min(1),
  description: z.string().min(1),
  confidence: z.number().min(0).max(1),
  safetyCritical: z.boolean(),
});

export const DiagnosisResultSchema = z.object({
  faults: z.array(FaultEntrySchema).min(1),
  summary: z.string().min(1),
  safetyCritical: z.boolean(),
});

export const PartsInputSchema = z.object({
  faultKey: z.string().min(1),
});

export const SuppliersQuerySchema = z.object({
  categories: z.string().optional().default(""),
  lat: z.coerce.number().optional().default(46.4917),
  lng: z.coerce.number().optional().default(-80.993),
});
