import { type NextPage } from 'next'
import { useState } from 'react'
import { Pagination } from '../components/Pagination'
import { Play } from '../components/Play'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: playCount } = api.play.getCountApproved.useQuery()
  const { data: plays } = api.play.getAllApproved.useQuery({ currentPage, pageSize })

  return (
    <main>
      <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Playbook
          </h1>
        </div>

        {playCount && plays && (
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
