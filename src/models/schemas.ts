import { z } from "zod";

export const relatedSchema = z.object({
  data: z.array(
    z.object({
      probability: z.number().min(0).max(1),
      name: z.nullable(z.optional(z.string())),
      id: z.string(),
    })
  ),
});
