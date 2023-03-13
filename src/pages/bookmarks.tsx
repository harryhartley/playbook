import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { PlayListContainer } from '../components/Play/PlayListContainer'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: session } = useSession()

  const { data: playsCount } = api.play.getCountBookmarked.useQuery(undefined, { refetchOnWindowFocus: false })
  const { data: plays } = api.play.getAllBookmarked.useQuery(
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
      <PlayListContainer
        title='Bookmarked Plays'
        plays={plays}
        playsCount={playsCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
    </main>
  )
}

export default Home
