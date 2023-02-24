/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { Play } from '../../components/Play'
import { api } from '../../utils/api'

const Home: NextPage = () => {
  const { query } = useRouter()
  if (typeof query.userId !== 'string') return <p>Bad ID</p>
  const user = api.user.getById.useQuery(query.userId)
  const userPlayCount = api.user.getPlayCountById.useQuery(query.userId)
  const { data: userPlays } = api.play.getAllByUserId.useQuery(query.userId)
  if (!user || !userPlayCount) return <p>Loading user...</p>

  return (
    <>
      <main>
        <div className='flex items-center gap-8 space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            {user.data?.name}
          </h1>
          <img src={user.data?.image ?? ''} alt='Profile Image' width={100} height={100} />
        </div>
        <h2 className='md:leading-14 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
          Plays: {userPlayCount.data?._count.plays}
        </h2>
        <ul className='divide-y'>
          {!userPlays && 'Loading plays...'}
          {userPlays && !userPlays.length && 'No plays found'}
          {userPlays && userPlays.map((play, idx) => <Play key={idx} play={play} youtubeEmbed={'none'} />)}
        </ul>
      </main>
    </>
  )
}

export default Home
