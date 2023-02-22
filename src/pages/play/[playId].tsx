import { type NextPage } from "next";
import { useRouter } from "next/router";
import { PlayCard } from "../../components/PlayCard";
import { api } from "../../utils/api";

const Home: NextPage = () => {
  const { query } = useRouter();
  if (typeof query.playId !== 'string') return <p>Bad ID</p>
  const play = api.play.getById.useQuery(query.playId);
  if (!play) return <p>Loading play...</p>
  
  return (
    <>
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