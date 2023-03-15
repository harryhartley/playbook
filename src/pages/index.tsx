import { type NextPage } from 'next'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { PlayListContainer } from '../components/Play/PlayListContainer'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: playsCount, isLoading: isLoadingCount } = api.play.getCountApproved.useQuery(
    {},
    { refetchOnWindowFocus: false }
  )
  const { data: plays, isLoading: isLoadingPlays } = api.play.getAllApproved.useQuery(
    { currentPage, pageSize, filter: {} },
    { refetchOnWindowFocus: false }
  )

  return (
    <main>
      {isLoadingPlays || isLoadingCount ? (
        <div className='flex justify-center'>
          <BeatLoader />
        </div>
      ) : (
        <PlayListContainer
          title='Latest Plays'
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
