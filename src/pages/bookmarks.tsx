import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { PlayListContainer } from '../components/Play/PlayListContainer'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: session } = useSession()

  const { data: playsCount, isLoading: isLoadingCount } = api.play.getCountBookmarked.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })
  const { data: plays, isLoading: isLoadingPlays } = api.play.getAllBookmarked.useQuery(
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
      {isLoadingPlays || isLoadingCount ? (
        <div className='flex justify-center'>
          <BeatLoader />
        </div>
      ) : (
        <PlayListContainer
          title='Bookmarked Plays'
          plays={plays}
          playsCount={playsCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
        />
      )}
    </main>
  )
}

export default Home
