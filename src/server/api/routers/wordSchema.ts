import { z } from "zod";

export const meaningSchema = z.object({
  id: z.string().optional(),
  meaning: z.string(),
  wordId: z.string().optional(),
  userId: z.string().optional(),
});

export const exampleSchema = z.object({
  id: z.string().optional(),
  example: z.string(),
  wordId: z.string().optional(),
  userId: z.string().optional(),
});

export const wordSchema = z.object({
  id: z.string().optional(),
  word: z.string(),
  from: z.string(),
  to: z.string(),
  userId: z.string(),
  meanings: z.array(meaningSchema),
  examples: z.array(exampleSchema).optional(),
});

export type Meaning = z.infer<typeof meaningSchema>;
export type Word = z.infer<typeof wordSchema>;

export const infiniteWordInputSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export type InfiniteWordInput = z.infer<typeof infiniteWordInputSchema>;
