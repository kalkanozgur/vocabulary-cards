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
  console.log("input", input);

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
  const { word, meanings, tags, definitions } = input;
  const { id: userId } = session.user;

  const create = prisma.word.create({
    data: {
      word,
      userId,
      level: 0,
      definitions: {
        create: definitions?.map((defination) => ({
          userId,
          type: defination.type,
          def: defination.def,
        })),
      },
      meanings: {
        create: meanings?.map((meaning) => ({
          userId,
          meaning: meaning.meaning,
        })),
      },
      tags: {
        create: tags.map((tag) => ({
          tag: tag.tag,
          userId: userId,
        })),
      },
    },
    include: {
      meanings: true,
      tags: true,
      definitions: true,
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
  const { id, word, meanings, definitions, tags, level } = input;

  const { id: userId } = session.user;

  // if meanings are provided, delete all existing meanings and create new ones
  const update = prisma.word.update({
    where: {
      id,
    },
    include: {
      meanings: true,
      definitions: true,
      tags: true,
    },
    data: {
      word,
      level,
      meanings: {
        deleteMany: {},
        create: meanings?.map((meaning) => ({
          userId,
          meaning: meaning.meaning,
        })),
      },
      definitions: {
        deleteMany: {},
        create: definitions?.map((defination) => ({
          userId,
          type: defination.type,
          def: defination.def,
        })),
      },
      tags: {
        deleteMany: {},
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
      definitions: true,
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
      tags: true,
      meanings: true,
      definitions: true,
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
      definitions: true,
      tags: true,
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
