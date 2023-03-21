import { createTRPCRouter } from "~/server/api/trpc";
import {
  deleteWordProcedure,
  getInfiniteWordsProcedure,
  getRecommendedWordsProcedure,
  getWordByIdProcedure,
  saveWordProcedure,
} from "./wordProcedures";

export const wordsRouter = createTRPCRouter({
  getWordByIdProcedure,
  getInfiniteWordsProcedure,
  saveWordProcedure,
  deleteWordProcedure,
  getRecommendedWordsProcedure,
});
