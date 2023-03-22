import { z } from "zod";

export const tagSchema = z.object({
  id: z.string().optional(),
  tag: z.string().default("default"),
  // words: z.array(wordSchema).optional(),
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
  userId: z.string(),
});

export const definationSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional().default("noun"),
  def: z.string().min(2),
  wordId: z.string().optional(),
  userId: z.string(),
  examples: z.array(exampleSchema).optional(),
});

export const wordSchema = z.object({
  id: z.string().optional(),
  word: z.string().min(2),
  level: z.number().optional().default(0),
  userId: z.string(),
  meanings: z.array(meaningSchema),
  definitions: z.array(definationSchema),
  tags: z.array(tagSchema),
});

export type Tag = z.infer<typeof tagSchema>;
export type Definition = z.infer<typeof definationSchema>;
export type Meaning = z.infer<typeof meaningSchema>;
export type Word = z.infer<typeof wordSchema>;

export const infiniteWordInputSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export type InfiniteWordInput = z.infer<typeof infiniteWordInputSchema>;

export const partOfSpeechSchema = z.object({
  type: z.enum([
    "noun",
    "pronoun",
    "adjective",
    "verb",
    "adverb",
    "preposition",
    "conjunction",
    "interjection",
  ]),
});
