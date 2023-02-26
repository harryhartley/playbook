import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Pagination } from '../components/Pagination'
import { Play } from '../components/Play'
import { api } from '../utils/api'
import { isUserModeratorOrAbove } from '../utils/auth'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: session } = useSession()

  if (session && !isUserModeratorOrAbove(session.user.role)) {
    return <p>Not authorised</p>
  }

  const { data: playCount } = api.play.getCount.useQuery()
  const { data: plays } = api.play.getAllUnapproved.useQuery({ currentPage, pageSize })

  return (
    <main>
      <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Unapproved Play Queue
          </h1>
        </div>

        {playCount && plays && typeof playCount === 'number' && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCount={playCount}
            pageSize={pageSize}
          />
        )}

        <ul className='divide-y'>
          {!plays && 'Loading plays...'}
          {plays && !plays.length && 'No plays found'}
          {plays && plays.map((play, idx) => <Play key={idx} play={play} youtubeEmbed={'inline'} />)}
        </ul>
      </div>
    </main>
  )
}

export default Home
