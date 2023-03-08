import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

export const wordsRouter = createTRPCRouter({
  // getWordsList publicProcedure with infinite scroll
  getWordsInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.word.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          meanings: true,
          examples: false,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),

  getWords: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany({
      include: {
        meanings: true,
        examples: false,
      },
    });
  }),
  getWord: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.word.findUnique({
      where: {
        id: input,
      },
    });
  }),
  saveWord: protectedProcedure
    .input(wordSchema)
    .mutation(async ({ input, ctx }) => {
      const { word, from, to, meanings, examples } = input;
      const { id: userId } = ctx.session.user;
      return ctx.prisma.word.create({
        include: {
          meanings: true,
          examples: true,
        },
        data: {
          word,
          from,
          to,
          userId,
          meanings: {
            create: meanings.map((meaning) => ({
              meaning: meaning.meaning,
              userId,
            })),
          },
          examples: {
            create: examples?.map((example) => ({
              example: example.example,
              userId,
            })),
          },
        },
      });
    }),

  editWord: protectedProcedure.input(wordSchema).query(({ input, ctx }) => {
    const { id, word, from, to, meanings } = input;
    const { id: userId } = ctx.session.user;
    return ctx.prisma.word.update({
      where: {
        id,
      },
      data: {
        word,
        from,
        to,
        updatedAt: new Date(),
        userId,
        meanings: {
          create: {
            meaning: meanings[0]?.meaning as string,
            userId,
          },
        },
      },
    });
  }),
});
