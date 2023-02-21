import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { PlayCard } from "../components/PlayCard";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: plays } = api.play.getAll.useQuery();
  
  return (
    <>
      <Head>
          <title>Playbook</title>
          <meta name="description" content="The Lethal League Blaze playbook" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center text-2xl m-2">PLAYBOOK</div>
        <button className="rounded-full bg-red-300 px-10 py-3" onClick={sessionData ? () => void signOut() : () => void signIn()}>
          {sessionData ? "Sign out" : "Sign in"}
        </button>
        <p>{ sessionData?.user.name ? `Signed in as ${sessionData.user.name}` : "Not signed in"}</p>
        <div className="flex flex-wrap">
          {plays && plays.map((play, idx) => (
            <div className={`w-1/2 p-2`} key={`play-${idx}`}>
              <PlayCard key={idx} {...play} />
            </div>
          ))}
        </div>
      </main>
    </>
  )
};

export default Home;