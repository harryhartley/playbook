import { FireIcon } from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import Link from "next/link";
import { Tag } from "../components/Tag";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: plays } = api.play.getAll.useQuery();
  
  return (
    <>
      <main>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-9 sm:leading-10 md:leading-14 tracking-tight text-gray-900 dark:text-gray-100 ">
              Latest Plays
            </h1>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!plays && 'Loading plays...'}
            {plays && !plays.length && 'No plays found'}
            {plays && plays.map((play, idx) => {
            const id = play.id
            return(
              <li key={idx} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={play.createdAt.toLocaleDateString('en-CA')}>{play.createdAt.toLocaleDateString('en-CA')}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={{ pathname: '/play/[id]', query: { id } }} className="text-gray-900 dark:text-gray-100">
                              {play.name}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {[
                              play.character, play.type, play.speed, play.stage, play.environment
                            ].map((tag, idx) => <Tag key={idx} text={tag} />)}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {play.description}
                        </div>
                      </div>
                      {/* <div className="text-base font-medium leading-6">
                        <Link href={''} className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          Read more
                        </Link>
                      </div> */}
                      <div>
                        {Array(play.difficulty).fill(0).map((e, i) => (
                          <button key={`fire-${i}`} className="mb-3 text-red-500">
                              <FireIcon className="h-8 w-8" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )})}
          </ul>
        </div>
        {/* <div className="flex flex-wrap">
          {plays && plays.map((play, idx) => (
            <div className={`w-1/2 p-2`} key={`play-${idx}`}>
              <PlayCard key={idx} {...play} />
            </div>
          ))}
        </div> */}
      </main>
    </>
  )
};

export default Home;