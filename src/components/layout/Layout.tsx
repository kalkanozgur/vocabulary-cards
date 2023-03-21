import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <main className="relative flex flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#9a9ddb]">
        <header className="flex w-full items-center justify-between px-4 py-4">
          <Link className="text-2xl tracking-tight text-white" href={"/"}>
            Vocabulary Cards
          </Link>
          <AuthShowcase />
          <></>
        </header>
        <Toaster />
        <section className="container relative flex flex-col items-center gap-12 px-4 py-16">
          {props.children}
        </section>
      </main>
    </>
  );
};

export default Layout;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-xl text-white">
        {sessionData && <span>{sessionData.user?.name}</span>}
        <button
          className=" rounded-md bg-white/10 bg-indigo-500 px-3 py-2  text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </p>
    </div>
  );
};
