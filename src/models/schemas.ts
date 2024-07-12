import { z } from "zod";

export const predictionSchema = z.object({
  probability: z.number().min(0).max(1),
});

export const relatedSchema = z.object({
  probability: z.number().min(0).max(1),
  name: z.string(),
});
