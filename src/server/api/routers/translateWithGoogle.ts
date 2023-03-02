import { prisma } from "~/server/db";
// translate given input to english using google translate
//
// @param input - input to translate
// @returns translated input
// */
//

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const translateWithGoogleRouter = createTRPCRouter({
  translate: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const { text  } = input;
      //// given text, translate to english using google translate without using api key
      // const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${text}`;
      // given turkish text, translate to english using google translate without using api key
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${text}`;

      // given english text, translate to turkish using google translate without using api key
      const urI = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${text}`;
      const response = await fetch(url);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      // const translatedText = data[0][0][0];
      // console.log("translatedText", translatedText);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      const results = data[0].map((item: any) => item[0]);

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        results,
      };
    }),
});
