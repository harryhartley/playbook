import { type NextPage } from 'next'
import { useState } from 'react'
import { Play } from '../components/Play'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const neighbours = 3

  const { data: playCount } = api.play.getCount.useQuery()
  const { data: plays } = api.play.getAllApproved.useQuery({ currentPage, pageSize })

  return (
    <main>
      <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Latest Plays
          </h1>
        </div>
        {playCount && plays && typeof playCount === 'number' && (
          <ul className='flex justify-center'>
            <li onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}>&lt;</li>
            {Array(Math.ceil(playCount / pageSize))
              .fill(0)
              .map((_, idx) => {
                if (idx + 1 === currentPage - neighbours - 1 || idx + 1 === currentPage + neighbours + 1) {
                  return <li key={idx}>&#8230;</li>
                }
                if (idx + 1 < currentPage - neighbours || idx + 1 > currentPage + neighbours) {
                  return null
                }
                return (
                  <li key={idx} onClick={() => setCurrentPage(idx + 1)}>
                    {idx + 1}
                  </li>
                )
              })}
            <li
              onClick={() =>
                setCurrentPage(currentPage === Math.ceil(playCount / pageSize) ? currentPage : currentPage + 1)
              }
            >
              &gt;
            </li>
          </ul>
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
