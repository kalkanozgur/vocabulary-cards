import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import type { Word } from "~/server/api/routers/wordSchema";

const Card: React.FC<Word> = (props: Word) => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  // a card is flipped when the user clicks on it and the backside is shown to the user
  // the user can click on the card again to flip it back to the frontside
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div
        className="[perspective: 600px] relative flex h-64 w-64 transform cursor-pointer flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#2e026d] to-[#15162c] shadow-lg transition duration-500 ease-in-out"
        onClick={flipCard}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onDoubleClick={async () => {
          console.log("double click");
          await router.push({
            pathname: "/word",
            query: { id: props.id },
          });
        }}
      >
        <div className="relative flex h-full w-full flex-col">
          <>
            {isFlipped ? (
              <div className="absolute flex h-full w-full flex-col items-center justify-center gap-4">
                {props.meanings?.map((meaning) => (
                  <h1
                    className="text-2xl font-bold text-white"
                    key={meaning.meaning}
                  >
                    {meaning.meaning}
                  </h1>
                ))}
              </div>
            ) : (
              <div className="absolute flex h-full w-full flex-col items-center justify-center gap-4">
                <h1 className="relative text-2xl font-bold text-white ">
                  {props.word}
                </h1>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Card;
