import { useState } from "react";

import { GrConfigure } from "react-icons/gr";
import Link from "next/link";
import { useRouter } from "next/router";
import { Word } from "~/server/api/routers/wordSchema";

const Card: React.FC<Word> = (props: Word) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  // a card is flipped when the user clicks on it and the backside is shown to the user
  // the user can click on the card again to flip it back to the frontside
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  const selectValue = async () => {
    await router.push({
      pathname: "/word",
      query: JSON.stringify(props),
    });
  };

  return (
    <>
      <div
        className="[perspective: 600px] relative flex h-64 w-64 transform cursor-pointer flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#2e026d] to-[#15162c] shadow-lg transition duration-500 ease-in-out"
        onClick={flipCard}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onDoubleClick={() => {
          console.log("double click");
          // await router.push({
          //   pathname: "/word",
          //   query: { data: JSON.stringify(props) },
          // });
        }}
      >
        <div className="relative flex h-full w-full flex-col">
          <>
            <Link
              href={{
                pathname: "/word",
                query: { data: props.id },
              }}
              className="p-2"
            >
              <GrConfigure className="text-slate-300 duration-200 hover:scale-125" />
            </Link>
            {isFlipped ? (
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
                <h1 className="relative text-2xl font-bold text-white ">
                  {props.word}
                </h1>
              </div>
            ) : (
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
                {props.meanings.map((meaning) => (
                  <h1
                    className="text-2xl font-bold text-white"
                    key={meaning.meaning}
                  >
                    {meaning.meaning}
                  </h1>
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Card;
