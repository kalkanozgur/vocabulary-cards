import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next/types";
import React, { useState } from "react";
import Card from "~/components/Card";
import type { CardProps } from "~/components/Card/Card.types";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const cards: CardProps[] = [
    {
      id: 1,
      tr: "kalem",
      en: "pencil",
    },
    {
      id: 2,

      tr: "defter",
      en: "notebook",
    },
    {
      id: 3,
      tr: "silgi",
      en: "eraser",
    },
    {
      id: 4,
      tr: "kitap",
      en: "book",
    },
    {
      id: 5,
      tr: "kalemlik",
      en: "pencil case",
    },
    {
      id: 6,
      tr: "kalemlik",
      en: "pencil case",
    },
    {
      id: 7,
      tr: "kalemlik",
      en: "pencil case",
    },
  ];

  return (
    <>
      <Head>
        <title>Vocabulary Cards</title>
        <meta
          name="description"
          content="Vocabulary cards for learning new words"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {/* search box for translate tr to en */}
        <div className="flex w-full max-w-[600px] flex-row items-center justify-center gap-4">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            value={text}
            onChange={(e) => {
              e.preventDefault();
              setText(e.target.value);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          />
          {/* button for adding new card */}
          <Link
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 pb-1 text-white"
            href={"add"}
          >
            <h1 className="text-2xl ">+</h1>
          </Link>
        </div>

        <section className="grid grid-cols-5 gap-4 md:gap-8">
          {
            // translated card element
            cards.map((card: CardProps) => (
              <Card key={card.id} id={card.id} tr={card.tr} en={card.en} />
            ))
          }
        </section>
      </>
    </>
  );
};

export default Home;
