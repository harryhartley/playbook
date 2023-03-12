import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Pagination } from '../components/Pagination'
import { Play } from '../components/Play'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: session } = useSession()

  const { data: plays } = api.play.getBookmarkedPlays.useQuery(
    {
      currentPage,
      pageSize,
    },
    { enabled: !!session, refetchOnWindowFocus: false }
  )

  if (!session) {
    return <p>Not signed in</p>
  }

  return (
    <main>
      <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Bookmarked Plays
          </h1>
        </div>

        {plays && plays.length > 0 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCount={plays?.length}
            pageSize={pageSize}
          />
        )}

        <ul className='divide-y'>
          {!plays && 'Loading plays...'}
          {plays && plays.length === 0 && 'No plays found'}
          {plays &&
            plays.length > 0 &&
            plays.map((play, idx) => <Play key={idx} play={play} youtubeEmbed={'inline'} postButton={false} />)}
        </ul>
      </div>
    </main>
  )
}

export default Home
