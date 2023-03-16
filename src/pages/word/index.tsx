import { getSession, signIn, useSession } from "next-auth/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";
import { WordInput, WordInputwithRich } from "~/components/Word/WordInput";

import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { Meaning, Word } from "~/server/api/routers/wordSchema";
import { appRouter } from "~/server/api/root";

import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!context.query.id) {
    return {
      props: {
        session,
      },
    };
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: session,
    }),
    transformer: superjson,
  });
  await ssg.word.getWordByIdProcedure.fetch(context.query.id as string);

  return {
    props: { trpcState: ssg.dehydrate() },
  };
};

export default function WordPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  let kelime: Word;
  if (props.trpcState) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    kelime = props.trpcState.json.queries[0].state.data;
  }

  const router = useRouter();
  const { text } = router.query;

  const { data: sessionData } = useSession();

  const [input1, setInput1] = useState(() => {
    if (text) return text as string;
    if (kelime) return kelime.word;
    return "";
  });
  const [input2, setInput2] = useState(() => {
    if (kelime) return kelime.meanings[0]?.meaning as string;
    return "";
  });
  const [language, setLanguage] = useState("en");
  const [meanings, setMeanings] = useState<Meaning[]>(() => {
    if (kelime) return kelime.meanings;
    return [
      {
        userId: sessionData?.user.id,
        meaning: input2,
      } as Meaning,
    ];
  });
  const [word, setWord] = useState(() => {
    if (kelime) return kelime;
    return {
      word: input1,
      from: "en",
      to: "tr",
      userId: sessionData?.user.id,
      meanings: meanings,
    } as Word;
  });

  const saveWord = api.word.saveWordProcedure.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      await router.push("/");
    },
    onError: async (error) => {
      console.log("error", error);
      if (error.message === "UNAUTHORIZED") {
        await signIn();
      }
    },
  });

  return (
    <>
      <form className="flex w-7/12 flex-col">
        <WordInputwithRich
          value={input1}
          setValue={setInput1}
          language={language}
          setLanguage={setLanguage}
          onRecord={() => {
            console.log("record");
          }}
          onChange={(value) => {
            setWord({ ...word, word: value });
          }}
        />

        {meanings.map((meaning, index) => (
          <div key={index} className="relative">
            <input
              className=" relative mt-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              key={index}
              value={meaning.meaning}
              onChange={(e) => {
                setMeanings(
                  meanings.map((item, i) => {
                    if (i === index) {
                      return { ...item, meaning: e.target.value };
                    }
                    return item;
                  })
                );
              }}
              onBlur={() => {
                setWord({
                  ...word,
                  meanings: meanings,
                });
              }}
            />
            <div className="absolute top-0 right-0 flex flex-row">
              <button
                className="rounded bg-[#2e026d]/90 py-2 px-4 font-bold text-white duration-300 hover:bg-[#9a9ddb]/10"
                onClick={(e) => {
                  e.preventDefault();
                  setMeanings(meanings.filter((item, i) => i !== index));
                }}
              >
                X
              </button>
              <button
                className="rounded bg-[#2e026d]/90 py-2 px-4 font-bold text-white duration-300 hover:bg-[#9a9ddb]/10"
                onClick={(e) => {
                  e.preventDefault();
                  setMeanings([
                    ...meanings,
                    {
                      userId: sessionData?.user.id,
                      meaning: "",
                    } as Meaning,
                  ]);
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}

        <button
          className=" mt-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            try {
              saveWord.mutate(word);
            } catch (error) {
              alert(error);
            }
          }}
        >
          Submit
        </button>
      </form>
      {saveWord.isLoading && <div>loading</div>}
      <WordShowCase word={word} />
    </>
  );
}

const WordShowCase: React.FC<{ word: Word }> = ({ word }) => {
  return (
    <div className="flex w-7/12 flex-col">
      <div className="flex flex-row">
        Word: {word.word} - {word.from} - {word.to}
      </div>
      <div className="flex flex-col">
        {word.meanings.map((meaning) => (
          <div key={meaning.id} className="flex flex-col">
            {meaning.meaning}
          </div>
        ))}
      </div>
    </div>
  );
};
