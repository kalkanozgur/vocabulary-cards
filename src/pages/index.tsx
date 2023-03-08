import Head from "next/head";
import Link from "next/link";
import type { GetStaticPropsContext, NextPage } from "next/types";
import React, { useState } from "react";
import Card from "~/components/Card";

import { api } from "~/utils/api";
import type { Word } from "@prisma/client";

const Home: NextPage = () => {
  const [text, setText] = useState("");

  const [words, setWords] = useState<Word[]>([]);

  const myquery = api.word.getWordsInfinite.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data, error, fetchNextPage, isFetchingNextPage } = myquery;

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
            href={"word"}
          >
            <h1 className="text-2xl ">+</h1>
          </Link>
        </div>

        <section className="grid grid-cols-5 gap-4 md:gap-8">
          {error ? <h1>error</h1> : null}
          {data
            ? data.pages.map((page) => {
                return page.items.map((item) => {
                  return <Card key={item.id} {...item} />;
                });
              })
            : "Loading..."}
        </section>
      </>
    </>
  );
};

export default Home;
