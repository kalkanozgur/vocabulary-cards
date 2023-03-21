import { useRouter } from "next/router";
import { useState } from "react";
import { Word } from "~/server/api/routers/wordSchema";

const FlipableWordCard: React.FC<Word> = (props: Word) => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <div
        //card container
        className="card-container flex flex-col items-center justify-center"
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
      >
        <section className="flex h-screen items-center justify-center gap-x-16 bg-gray-900 text-white">
          <div className="perspective group h-[420px] w-[300px] cursor-pointer bg-transparent">
            <div className="preserve-3d group-hover:my-rotate-y-180 relative h-full w-full duration-1000">
              <div className="backface-hidden absolute h-full w-full border-2">
                FRONT
              </div>
              <div className="my-rotate-y-180 backface-hidden absolute h-full w-full overflow-hidden bg-gray-100">
                <div className="flex h-full flex-col items-center justify-center px-2 pb-24 text-center text-gray-800">
                  <h1 className="text-3xl font-semibold">{"The King's Man"}</h1>
                  <p className="my-2">{"9.0 Rating"}</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Facilis itaque assumenda saepe animi maxime libero non
                    quasi, odit natus veritatis enim culpa nam inventore
                    doloribus quidem temporibus amet velit accusamus.
                  </p>
                  <button className="absolute -bottom-20 scale-0 rounded-full bg-teal-500 px-6 py-2 font-semibold text-white delay-500 duration-1000 group-hover:bottom-20 group-hover:scale-125">
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FlipableWordCard;

{
  /* <section className="flex h-screen items-center justify-center gap-x-16 bg-gray-900 text-white">
  <div className="perspective group h-[420px] w-[300px] cursor-pointer bg-transparent">
    <div className="preserve-3d group-hover:my-rotate-y-180 relative h-full w-full duration-1000">
      <div className="backface-hidden absolute h-full w-full border-2">
        FRONT
      </div>
      <div className="my-rotate-y-180 backface-hidden absolute h-full w-full overflow-hidden bg-gray-100">
        <div className="flex h-full flex-col items-center justify-center px-2 pb-24 text-center text-gray-800">
          <h1 className="text-3xl font-semibold">{"The King's Man"}</h1>
          <p className="my-2">{"9.0 Rating"}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Facilis itaque assumenda saepe animi maxime libero non
            quasi, odit natus veritatis enim culpa nam inventore
            doloribus quidem temporibus amet velit accusamus.
          </p>
          <button className="absolute -bottom-20 scale-0 rounded-full bg-teal-500 px-6 py-2 font-semibold text-white delay-500 duration-1000 group-hover:bottom-20 group-hover:scale-125">
            Watch Now
          </button>
        </div>
      </div>
    </div>
  </div>
</section>; */
}
