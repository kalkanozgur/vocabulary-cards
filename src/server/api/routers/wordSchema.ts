import { z } from "zod";

export const definationSchema = z.object({
  id: z.string().optional(),
  def: z.string().min(2),
  wordId: z.string().optional(),
  userId: z.string(),
});

export const tagSchema = z.object({
  id: z.string().optional(),
  tag: z.string().default("none"),
  wordId: z.string().optional(),
  userId: z.string(),
});

export const meaningSchema = z.object({
  id: z.string().optional(),
  meaning: z.string().min(2),
  wordId: z.string().optional(),
  userId: z.string(),
});

export const exampleSchema = z.object({
  id: z.string().optional(),
  example: z.string().min(2),
  wordId: z.string().optional(),
  userId: z.string(),
});

export const wordSchema = z.object({
  id: z.string().optional(),
  word: z.string().min(2),
  type: z.string().optional().default("noun"),
  level: z.number().optional().default(0),
  userId: z.string(),
  meanings: z.array(meaningSchema).optional(),
  definitions: z.array(definationSchema).optional(),
  tags: z.array(tagSchema).optional(),
  examples: z.array(exampleSchema).optional(),
});

export type Meaning = z.infer<typeof meaningSchema>;
export type Word = z.infer<typeof wordSchema>;

export const infiniteWordInputSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export type InfiniteWordInput = z.infer<typeof infiniteWordInputSchema>;
