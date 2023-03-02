import type { NextPage } from "next";
import { useState } from "react";

import { api } from "~/utils/api";

import { FaMicrophone } from "react-icons/fa";

const Add: NextPage = () => {
  const [tr, setTr] = useState("elma");
  const translate = () => {
    const data = api.translateWithGoogle.translate.useQuery({ text: tr });
    return data;
  };

  return (
    <>
      {/* Adding new word */}
      <div className="relative flex w-full flex-row">
        <div className="relative flex w-full flex-col justify-center">
          <input
            type="text"
            className=" w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            placeholder="Turkish"
            value={tr}
            onChange={(e) => {
              e.preventDefault();
              setTr(e.target.value);
            }}
            onSubmit={() => {
              console.log("submit");
              translate();
            }}
          />
          <div className="absolute inset-y-0 right-0 z-10 flex items-center">
            <button
              type="button"
              className="inline-button mr-1 ml-1"
              onClick={() => {
                console.log("click");
              }}
            >
              EN
            </button>
            <button type="button" className="inline-button mr-1 ml-1">
              TR
            </button>
          </div>
        </div>
        {/* icon button for speech to text */}
        <button type="button" className=" flex items-center">
          <FaMicrophone className="m-3 h-20 w-20 text-gray-500 duration-300 hover:scale-125 hover:blur-[2px]" />
        </button>
      </div>

      <p>{JSON.stringify(translate().data)}</p>

      <button>Add</button>
    </>
  );
};

export default Add;
