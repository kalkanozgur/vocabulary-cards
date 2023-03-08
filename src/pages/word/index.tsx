import { useSession } from "next-auth/react";
import type { NextPage } from "next/types";
import { useState } from "react";
import Card from "~/components/Card/Card";
import { WordInput, WordInputwithRich } from "~/components/Word/WordInput";

import type { Meaning, Word } from "~/server/api/routers/word";
import { api } from "~/utils/api";

import { useRouter } from "next/router";
let renderCount = 0;

const WordPage: NextPage = () => {
  renderCount++;
  console.log("renderCount: ", renderCount);
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [input1, setInput1] = useState("table");
  const [input2, setInput2] = useState("masa");
  const [language, setLanguage] = useState("en");
  // const [mean, setMean] = useState({} as Meaning);
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

  if (router.query.data) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: Word = JSON.parse(router.query.data as string);
    console.log("router.query has data: ", data);
    // setInput1(data.word);
    // data.meanings && setInput2(data.meanings[0].meaning);
  } else {
    console.log("router.query has no data");
  }

  const saveWord = api.word.saveWord.useMutation({
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
        userId=""
        meanings={word.meanings.map((meaning) => {
          return {
            meaning: meaning.meaning,
            userId: meaning.userId,
          };
        })}
      />
    </>
  );
};

export default WordPage;
