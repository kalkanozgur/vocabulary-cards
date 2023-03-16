import type { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
export async function addMeaningtoWord({
  prisma,
  input,
  session,
}: {
  prisma: PrismaClient;
  input: {
    wordId: string;
    id: string;
    meaning: string;
  };
  session: Session;
}) {
  const { wordId, meaning, id } = input;
  const userId = session.user.id;
  const updateMeaning = prisma.meaning.update({
    where: {
      id,
    },
    data: {
      meaning,
      userId,
      wordId,
    },
  });
  return updateMeaning;
}
