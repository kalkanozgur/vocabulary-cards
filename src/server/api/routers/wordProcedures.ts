import { infiniteWordInputSchema, wordSchema } from "./wordSchema";
import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../trpc";
import {
  editWord,
  getInfiniteWords,
  getWordById,
  saveWord,
} from "./wordFunctions";

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

export const saveWordProcedure = protectedProcedure
  .input(wordSchema)
  .mutation(async ({ input, ctx }) => {
    await saveWord({ prisma: ctx.prisma, input, session: ctx.session });
  });

export const editWordProcedure = protectedProcedure
  .input(wordSchema)
  .mutation(async ({ input, ctx }) => {
    await editWord({ prisma: ctx.prisma, input, session: ctx.session });
  });
