import type { InfiniteWordInput, Word } from "./wordSchema";
import type { PrismaClient } from "@prisma/client";

import { type Session } from "next-auth";

export async function saveWord({
  prisma,
  input,
  session,
}: {
  prisma: PrismaClient;
  input: Word;
  session: Session;
}) {
  const { id } = input;
  if (id) {
    return editWord({ prisma, input, session });
  } else {
    return createWord({ prisma, input, session });
  }
}

export async function createWord({
  prisma,
  input,
  session,
}: {
  prisma: PrismaClient;
  input: Word;
  session: Session;
}) {
  const { word, meanings, examples, tags, definitions, type } = input;
  const { id: userId } = session.user;
  const create = prisma.word.create({
    data: {
      word,
      userId,
      level: 0,
      type,
      // add meanings without a wordId
      // (wordId will be added when the word is created)
      meanings: {
        create: meanings?.map((meaning) => ({
          userId,
          meaning: meaning.meaning,
        })),
      },
      examples: {
        create: examples,
      },
      tags: {
        create: tags,
      },
    },
    include: {
      meanings: true,
      examples: true,
      tags: true,
    },
  });
  return prisma.$transaction([create]);
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
  const { id, word, meanings, examples, tags, type, level } = input;

  const { id: userId } = session.user;

  // if meanings are provided, delete all existing meanings and create new ones
  const update = prisma.word.update({
    where: {
      id,
    },
    include: {
      meanings: true,
      examples: true,
      tags: true,
    },
    data: {
      word,
      type,
      level,
      meanings: {
        deleteMany: {},
        create: meanings?.map((meaning) => ({
          userId,
          meaning: meaning.meaning,
        })),
      },
      examples: {
        create: examples,
      },
      tags: {
        create: tags,
      },
    },
  });
  return prisma.$transaction([update]);
}

export async function deleteWord({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: string;
  session: Session;
}) {
  const deleteWord = prisma.word.delete({
    where: {
      id: input,
    },
    include: {
      meanings: true,
      examples: true,
      tags: true,
    },
  });
  return prisma.$transaction([deleteWord]);
}

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
