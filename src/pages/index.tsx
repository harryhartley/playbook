import { type NextPage } from "next";
import Head from "next/head";
import { PlayCard } from "../components/PlayCard";

const Home: NextPage = () => {
  // const { data: plays } = api.play.getAll.useQuery();
  const plays = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    }
  ]
  
  return (
    <>
      <Head>
          <title>Playbook</title>
          <meta name="description" content="The Lethal League Blaze playbook" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center text-2xl m-2">PLAYBOOK</div>
        <div className="flex flex-wrap">
          {plays.map((play, idx) => (
            <div className={`w-full p-2`} key={`play-${idx}`}>
              <PlayCard key={idx} {...play} />
            </div>
          ))}
        </div>
      </main>
    </>
  )
};

export default Home;