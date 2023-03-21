import { z } from "zod";
// #region eslint-disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// #endregion

const recommendations = z.object({
  partOfSpeech: z.string(),
  definitions: z.array(
    z.object({
      definition: z.string(),
      antonyms: z.array(z.any()),
      synonyms: z.array(z.string()),
    })
  ),
  antonyms: z.array(z.any()),
  synonyms: z.array(z.string()),
});

export type Recommendations = z.infer<typeof recommendations>;

// translate to turkish given Word and return words with same meaning
export const translateWithDictionaryapi = async ({
  word,
}: {
  word: string;
}) => {
  console.log("word", word);

  const recommendsList = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  ).then((res) => res.json());

  const recommends: Recommendations[] = recommendsList[0].meanings.map(
    (meaning: Recommendations) => {
      return meaning;
    }
  );
  console.log("recommends", recommends);

  return recommends;
};
