import { createTRPCRouter } from "~/server/api/trpc";
import {
  editWordProcedure,
  getInfiniteWordsProcedure,
  getWordByIdProcedure,
  saveWordProcedure,
} from "./wordProcedures";

export const wordsRouter = createTRPCRouter({
  // getWordsList publicProcedure with infinite scroll
  getWordByIdProcedure,
  getInfiniteWordsProcedure,
  saveWordProcedure,
  editWordProcedure,
});
