import { infiniteWordInputSchema, wordSchema } from "./wordSchema";
import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../trpc";
import {
  deleteWord,
  getInfiniteWords,
  getWordById,
  saveWord,
} from "./wordFunctions";
import { translateWithDictionaryapi } from "./recommended";

// #region recommended
export const getRecommendedWordsProcedure = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return translateWithDictionaryapi({ word: input });
  });

// #endregion

// #region crud operations for words
export const saveWordProcedure = protectedProcedure
  .input(wordSchema)
  .mutation(async ({ input, ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await saveWord({ prisma: ctx.prisma, input, session: ctx.session });
  });

export const getWordByIdProcedure = publicProcedure
  .input(z.string())
  .query(async ({ input, ctx }) => {
    return getWordById({ prisma: ctx.prisma, input });
  });

export const getInfiniteWordsProcedure = publicProcedure
  .input(infiniteWordInputSchema)
  .query(async ({ input, ctx }) => {
    return getInfiniteWords({ prisma: ctx.prisma, input });
  });

export const deleteWordProcedure = protectedProcedure
  .input(z.string())
  .mutation(async ({ input, ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await deleteWord({ prisma: ctx.prisma, input, session: ctx.session });
  });

// #endregion
