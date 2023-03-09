import { getSession, useSession } from "next-auth/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";
import Card from "~/components/Card/Card";
import { WordInput, WordInputwithRich } from "~/components/Word/WordInput";

import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { Meaning, Word } from "~/server/api/routers/wordSchema";
import { appRouter } from "~/server/api/root";

import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
let renderCount = 0;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  if (!context.query.data) {
    return {
      props: {
        session,
      },
    };
  }
  console.log("context.query.data: ", context.query.data);

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: session,
    }),
    transformer: superjson,
  });
  await ssg.word.getWordByIdProcedure.fetch(context.query.data as string);

  return {
    props: { trpcState: ssg.dehydrate() },
  };
};

export default function WordPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  renderCount++;
  console.log("renderCount: ", renderCount);
  console.log("props: ", props);

  const { data: sessionData } = useSession();

  const [input1, setInput1] = useState("table");
  const [input2, setInput2] = useState("masa");
  const [language, setLanguage] = useState("en");
  const [word, setWord] = useState({
    word: input1,
    from: "en",
    to: "tr",
    userId: sessionData?.user.id,
    meanings: [
      {
        userId: sessionData?.user.id,
        meaning: input2,
      } as Meaning,
    ],
  } as Word);

  const saveWord = api.word.saveWordProcedure.useMutation({
    onSuccess: (data) => {
      console.log(data);
      alert(`onSuccess: ${JSON.stringify(data)}`);
    },
    onError: (error) => {
      console.log(error);
      alert(error);
    },
    onMutate: (word: Word) => {
      console.log(word);

      alert(`onMutate: ${JSON.stringify(word)}`);
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
        <WordInput
          value={input2}
          setValue={(input2) => {
            setInput2(input2);
          }}
          onChange={(value) => {
            setWord({ ...word, meanings: [{ meaning: value }] });
          }}
        />
        <button
          className="my-2 rounded-md border border-gray-300 bg-slate-600 p-2 text-black"
          type="submit"
          onClick={(e) => {
            e.preventDefault();

            console.log(word);

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
      <Card
        word={word.word}
        from={word.from}
        to={word.to}
        userId={word.userId}
        meanings={word.meanings.map((meaning) => {
          return {
            meaning: meaning.meaning,
          };
        })}
      />
    </>
  );
}
