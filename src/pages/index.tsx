import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { type NextPage } from 'next'
import { useState } from 'react'
import { Play } from '../components/Play'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const neighbours = 2

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
          <div className='flex justify-center'>
            <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
              <button
                onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
                className='relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
              >
                <span className='sr-only'>Previous</span>
                <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              </button>
              {Array(Math.ceil(playCount / pageSize))
                .fill(0)
                .map((_, idx) => {
                  if (idx + 1 === currentPage) {
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className='relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20'
                      >
                        {idx + 1}
                      </button>
                    )
                  }
                  if (idx + 1 === 1 || idx + 1 === Math.ceil(playCount / pageSize)) {
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
                      >
                        {idx + 1}
                      </button>
                    )
                  }
                  if (idx + 1 === currentPage - neighbours - 1 || idx + 1 === currentPage + neighbours + 1) {
                    return (
                      <span
                        key={idx}
                        className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700'
                      >
                        ...
                      </span>
                    )
                  }
                  if (idx + 1 < currentPage - neighbours || idx + 1 > currentPage + neighbours) {
                    return null
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              <button
                onClick={() =>
                  setCurrentPage(currentPage === Math.ceil(playCount / pageSize) ? currentPage : currentPage + 1)
                }
                className='relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
              >
                <span className='sr-only'>Next</span>
                <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            </nav>
          </div>
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
