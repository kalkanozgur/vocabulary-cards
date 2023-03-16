import type { InfiniteWordInput, Word } from "./wordSchema";
import type { PrismaClient } from "@prisma/client";

import { type Session } from "next-auth";

export async function getWordById({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: string;
}) {
  return prisma.word.findUnique({
    where: {
      id: input,
    },
    include: {
      meanings: true,
      examples: true,
    },
  });
}

export async function getInfiniteWords({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: InfiniteWordInput;
}) {
  const limit = input.limit ?? 50;
  const { cursor } = input;
  const items = await prisma.word.findMany({
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
    nextCursor = nextItem?.id;
  }
  return {
    items,
    nextCursor,
  };
}

export async function saveWord({
  prisma,
  input,
  session,
}: {
  prisma: PrismaClient;
  input: Word;
  session: Session;
}) {
  const { word, from, to, meanings, examples } = input;
  const { id: userId } = session.user;
  const save = await prisma.word.create({
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
  return save;
}

export async function editWord({
  prisma,
  input,
  session,
}: {
  prisma: PrismaClient;
  input: Word;
  session: Session;
}) {
  const { id, word, from, to, meanings, examples } = input;
  const { id: userId } = session.user;
  const edit = await prisma.word.update({
    where: {
      id,
    },
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
  return edit;
}
