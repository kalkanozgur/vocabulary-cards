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
  const recommendsList = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  ).then((res) => res.json());

  const recommends: Recommendations[] = recommendsList[0].meanings.map(
    (meaning: Recommendations) => {
      return meaning;
    }
  );

  return recommends;
};

export const translateWithGoogle = async ({ word }: { word: string }) => {
  const translate = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${word}`
  )
    .then((res) => res.json())
    .then((res) => res.flat(2));

  // remove null, undefined, empty, "en", "tr", input word and numbers from array
  const filtered: string[] = translate.filter(
    (item: string) =>
      item !== null &&
      item !== undefined &&
      item !== "" &&
      item !== " " &&
      item !== "en" &&
      item !== "tr" &&
      item !== word &&
      !Number(item)
  );

  return filtered;
};

export const translateWithAzure = async ({ word }: { word: string }) => {
  const translate = await fetch(
    `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en&to=tr&to=de&to=fr&to=es&to=it&to=ja&to=ko&to=nl&to=pt&to=ru&to=zh-Hans&to=zh-Hant`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "b0a5b5c2d8e74e5c9e9c1c1a8b8a5b0d",
        "Ocp-Apim-Subscription-Region": "westeurope",
      },
      body: JSON.stringify([{ Text: word }]),
    }
  )
    .then((res) => res.json())
    .then((res) => res[0].translations);

  return translate;
};
