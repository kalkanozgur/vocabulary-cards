import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import React, { useState } from "react";
import Card from "~/components/Card";
import { appRouter } from "~/server/api/root";
import type { Word } from "~/server/api/routers/wordSchema";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: session,
    }),
    transformer: superjson,
  });
  await ssg.word.getInfiniteWordsProcedure.fetchInfinite({
    limit: 50,
  });

  return {
    props: { trpcState: ssg.dehydrate() },
  };
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [text, setText] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const { error } = props.trpcState.json.queries[0].state;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const items: Word[] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    props.trpcState.json.queries[0].state.data.pages[0].items;

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
            href={{
              pathname: "/word",
              query: text ? { text: text } : {},
            }}
          >
            <h1 className="text-2xl ">+</h1>
          </Link>
        </div>

        <section className="grid grid-cols-5 gap-4 md:gap-8">
          {error ? <h1>{JSON.stringify(error)}</h1> : null}
          {items
            ? items.map((item) => {
                return <Card key={item.id} {...item} />;
              })
            : "Loading..."}
        </section>
      </>
    </>
  );
}
