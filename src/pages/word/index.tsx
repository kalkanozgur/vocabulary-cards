import { getSession, signIn, useSession } from "next-auth/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";
import { WordInputwithRich } from "~/components/Word/WordInput";

import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { Meaning, Word } from "~/server/api/routers/wordSchema";
import { appRouter } from "~/server/api/root";

import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import type { Recommendations } from "~/server/api/routers/recommended";
import {
  translateWithDictionaryapi,
  translateWithGoogle,
} from "~/server/api/routers/recommended";

// #region ssr

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
// #endregion

export default function WordPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  // #region functions
  let kelime: Word;
  if (props.trpcState) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    kelime = props.trpcState.json.queries[0].state.data;
  }

  const router = useRouter();
  const { text } = router.query;

  const { data: sessionData } = useSession();

  const [recommended, setRecommended] = useState<Recommendations[]>();
  const recommendWord = async (input: string) => {
    const res = await translateWithDictionaryapi({ word: input });
    setRecommended(res);
  };

  const [translation, setTranslation] = useState();
  const translateWithYandex = async (input: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = await translateWithGoogle({ word: input });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setTranslation(res);
  };

  const [input1, setInput1] = useState(() => {
    if (text) {
      sessionData &&
        recommendWord(text as string).catch(() => {
          toast.error("Kelime önerilemedi");
        });
      return text as string;
    }
    if (kelime) {
      sessionData &&
        recommendWord(kelime.word).catch(() => {
          toast.error("Kelime önerilemedi");
        });
      return kelime.word;
    }
    return "";
  });

  const [word, setWord] = useState(() => {
    if (kelime) return kelime;
    return {
      word: input1,
      userId: sessionData?.user.id,
      meanings: [
        {
          userId: sessionData?.user.id,
          meaning: "",
          wordId: "",
        } as Meaning,
      ],
    } as Word;
  });

  const saveWord = api.word.saveWordProcedure.useMutation({
    onSuccess: async () => {
      toast.dismiss();
      toast.success("Kelime kaydedildi");
      await router.push("/");
    },
    onError: async (error) => {
      toast.dismiss();
      toast.error("Kelime kaydedilemedi");
      if (error.message === "UNAUTHORIZED") {
        await signIn();
      }
    },
  });

  const deleteWord = api.word.deleteWordProcedure.useMutation({
    onSuccess: async () => {
      toast.dismiss();
      toast.success("Kelime silindi");
      await router.push("/");
    },
    onError: async (error) => {
      toast.dismiss();
      toast.error("Kelime silinemedi");
      if (error.message === "UNAUTHORIZED") {
        await signIn();
      }
    },
  });

  saveWord.isLoading && toast.loading("Kelime kaydediliyor");
  deleteWord.isLoading && toast.loading("Kelime siliniyor");
  // #endregion

  return (
    <>
      <form className="flex w-7/12 flex-col">
        <>
          {/* wordType */}
          <div className="flex flex-row space-y-2">
            <div className="rounded-md bg-slate-500 p-3">
              <span className="text-white">{word.type}</span>
            </div>
          </div>
        </>
        <WordInputwithRich
          value={input1}
          setValue={setInput1}
          onRecord={() => {
            console.log("record");
          }}
          onChange={(value) => {
            setWord({ ...word, word: value });
          }}
          onBlur={() => {
            translateWithYandex(word.word).catch((e) => {
              toast.error("Kelime çevirisi yapılamadı");
              console.log(e);
            });
            recommendWord(word.word).catch((e) => {
              toast.error("Kelime önerilemedi");
              console.log(e);
            });
          }}
        />

        {/* Meanings */}
        <div className="flex flex-col space-y-2">
          {word.meanings.map((meaning, index) => (
            <div key={index} className="relative flex">
              <input
                key={index}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                type="text"
                placeholder="Enter words meaning"
                value={meaning.meaning}
                onChange={(e) => {
                  setWord({
                    ...word,
                    meanings: word.meanings.map((item, i) => {
                      if (i === index) {
                        return { ...item, meaning: e.target.value };
                      }
                      return item;
                    }),
                  });
                  // setMeanings(
                  //   meanings.map((item, i) => {
                  //     if (i === index) {
                  //       return { ...item, meaning: e.target.value };
                  //     }
                  //     return item;
                  //   })
                  // );
                }}
              />
              {(meaning.meaning || word.meanings.length > 1) && (
                <button
                  className="absolute right-0 top-0 mt-2 mr-2 rounded-full bg-red-500 p-1 px-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if (meaning.meaning) {
                      setWord({
                        ...word,
                        meanings: word.meanings.map((item, i) => {
                          if (i === index) {
                            return { ...item, meaning: "" };
                          }
                          return item;
                        }),
                      });
                    }
                    if (word.meanings.length > 1 && !meaning.meaning) {
                      setWord({
                        ...word,
                        meanings: word.meanings.filter(
                          (item, i) => i !== index
                        ),
                      });
                    }
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        {/*
        {/* Add Meaning */}
        <button
          className=" mt-4 w-3/12 rounded-md border border-teal-300 bg-teal-300 px-2 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          type="button"
          onClick={() => {
            setWord({
              ...word,
              meanings: [
                ...word.meanings,
                {
                  userId: sessionData?.user.id,
                  meaning: "",
                  wordId: word.id,
                } as Meaning,
              ],
            });
          }}
        >
          Add Meaning
        </button>
      </form>

      {/* Save Word Button */}
      <button
        className=" mt-4 w-5/12 rounded-md border border-teal-800 bg-teal-500 px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          saveWord.mutate(word);
        }}
      >
        Submit
      </button>

      {/* Translation */}
      {translation && (
        <div className="flex flex-row space-x-2">
          {JSON.stringify(translation)}
        </div>
      )}

      {/* Recommendations */}
      {recommended && (
        <div className="flex flex-row space-x-2">
          <RecommendationsShowCase
            recommended={recommended}
            setValue={(type, meaningString) => {
              setWord({
                ...word,
                type: type,
                meanings: [
                  ...word.meanings,
                  {
                    userId: sessionData?.user.id,
                    meaning: meaningString,
                    wordId: word.id,
                  } as Meaning,
                ],
              });
            }}
          />
        </div>
      )}

      {/* Delete Word Button */}
      {word.id && (
        <button
          // delete Word Button with tailwindcss absolute possition on top right
          className="absolute right-0 bottom-0 mt-2 mr-2 rounded-full bg-red-500 p-1 px-2"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            deleteWord.mutate(word.id as string);
          }}
        >
          Delete
        </button>
      )}

      {/* Showcase */}
      {word && word.meanings && sessionData && (
        <div className="flex flex-row space-x-2">
          <WordShowCase word={word} />
          <MeaningsShowCase meanings={word.meanings} />
        </div>
      )}
    </>
  );
}

const RecommendationsShowCase: React.FC<{
  recommended: Recommendations[];
  setValue: (type: string, meaningString: string) => void;
}> = ({ recommended, setValue }) => {
  return (
    <div className="flex flex-col rounded-lg bg-slate-800 p-2 text-white">
      <h1 className="text-2xl">Recommendations</h1>
      <ul className="flex flex-col">
        {recommended.map((recommendation, index) => (
          <>
            <li key={index} className="ml-2">
              <h1 className="text-xl">{recommendation.partOfSpeech}</h1>
              <ul className="flex flex-col space-y-2">
                {recommendation.definitions.map((definition, index) => (
                  <li key={index} className="ml-2">
                    <button
                      className="ml-2 rounded-full bg-teal-500 p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setValue(
                          recommendation.partOfSpeech,
                          definition.definition
                        );
                      }}
                    >
                      {"+"}
                    </button>
                    <span className="ml-2">{definition.definition}</span>
                  </li>
                ))}
              </ul>
            </li>

            <div className="w-full border-t border-gray-700"></div>
          </>
        ))}
      </ul>
    </div>
  );
};

// #region WordShowCase & MeaningsShowCase
const WordShowCase: React.FC<{ word: Word }> = ({ word }) => {
  return (
    <div className="flex w-9/12 flex-col rounded-lg bg-slate-800 p-2 text-white">
      <h1 className="text-2xl">Word Showcase</h1>
      <div className="flex flex-col">
        <span className="ml-2">Word: {word.word}</span>
        <span className="ml-2">id: {word.id}</span>
        <span className="ml-2">userId: {word.userId}</span>
        <span className="ml-2">Type: {word.type}</span>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl">Meanings</h1>
        <ul className="flex flex-col">
          {word.meanings?.map((meaning, index) => (
            <li key={index} className="ml-2 flex flex-col">
              <span className="">Meaning: {meaning.meaning}</span>
              <span className="ml-2">id: {meaning.id}</span>
              <span className="ml-2">userId: {meaning.userId}</span>
              <span className="ml-2">wordId: {meaning.wordId}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MeaningsShowCase: React.FC<{ meanings: Meaning[] }> = ({ meanings }) => {
  return (
    <div className="flex w-9/12 flex-col rounded-lg bg-slate-800 p-2 text-white">
      <h1 className="text-2xl">Meanings Showcase</h1>
      <div className="flex flex-col">
        {meanings.map((meaning, index) => (
          <li key={index} className="ml-2 flex flex-col">
            <span className="">Meaning: {meaning.meaning}</span>
            <span className="ml-2">id: {meaning.id}</span>
            <span className="ml-2">userId: {meaning.userId}</span>
            <span className="ml-2">wordId: {meaning.wordId}</span>
          </li>
        ))}
      </div>
    </div>
  );
};
// #endregion
