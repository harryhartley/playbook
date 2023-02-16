import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { PlayCard } from "../../components/PlayCard";

const Home: NextPage = () => {
  const { query } = useRouter();
  if (typeof query.playId !== 'string') return <p>Bad ID</p>
  // const play = api.play.getById.useQuery(query.playId);
  const play = { data: {
    id: 'a', 
    name: 'Test Play', 
    youtubeId: 'Sz6t18jN5M0',
    description: 'An advanced setup for doombox, utilizing instant flight out of bunt and airturn back spike.',
    type: "Offense",
    speed: "All",
    environment: "Training",
    character: "Doombox",
    stage: "All",
    difficulty: 4,
  }}
  if (!play) return <p>Loading play...</p>
  
  return (
    <>
      <Head>
          <title>Playbook</title>
          <meta name="description" content="The Lethal League Blaze playbook" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center text-2xl m-2">PLAYBOOK</div>
        <div className={`w-full p-2`}>
          <PlayCard {...play.data} />
        </div>
      </main>
    </>
  );
};

export default Home;