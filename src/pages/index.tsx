import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getSession } from "next-auth/react";
import Head from "next/head";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";
import Card from "~/components/Card";
import { appRouter } from "~/server/api/root";
import type { Word } from "~/server/api/routers/wordSchema";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import { useRouter } from "next/router";
import FlipableWordCard from "~/components/Card/FlipableWordCard";
import SwipableWordCard from "~/components/Card/SwipableWordCard";
import { toast } from "react-hot-toast";

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
  const router = useRouter();
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
          <form className="flex flex-row space-x-2">
            <input
              type="text"
              placeholder="Search | Add new word"
              name="Word"
              tabIndex={1}
              value={text}
              onChange={(e) => {
                e.preventDefault();
                setText(e.target.value);
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            />
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 pb-1 text-white"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async (e) => {
                e.preventDefault();
                await router.push({
                  pathname: "/word",
                  query: text ? { text: text } : {},
                });
              }}
            >
              <h1 className="text-2xl ">+</h1>
            </button>
          </form>
        </div>

        <section className="md:grid-col-4 grid gap-5 sm:grid-cols-4">
          {error &&
            toast.error(
              "Something went wrong while fetching the data. Please try again later."
            )}
          {items
            ? items.map((item) => {
                toast.dismiss();
                return <Card key={item.id} {...item} />;
              })
            : toast.loading("Loading...")}
        </section>
      </>
    </>
  );
}
