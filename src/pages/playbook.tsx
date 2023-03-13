import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import { useState } from 'react'
import { PlayListContainer } from '../components/Play/PlayListContainer'
import { api } from '../utils/api'
import { isInt, toTitleCase } from '../utils/string'

const generateFilter = (query: ParsedUrlQuery) => {
  return {
    ...(!!query.c && typeof query.c === 'string' && toTitleCase(query.c) !== 'All' && { c: toTitleCase(query.c) }),
    ...(!!query.d &&
      typeof query.d === 'string' &&
      isInt(query.d) &&
      parseInt(query.d, 10) >= 1 &&
      parseInt(query.d, 10) <= 5 && { d: Math.floor(parseInt(query.d, 10)) }),
    ...(!!query.e && typeof query.e === 'string' && toTitleCase(query.e) !== 'All' && { e: toTitleCase(query.e) }),
    ...(!!query.sp && typeof query.sp === 'string' && toTitleCase(query.sp) !== 'All' && { sp: toTitleCase(query.sp) }),
    ...(!!query.st && typeof query.st === 'string' && toTitleCase(query.st) !== 'All' && { st: toTitleCase(query.st) }),
    ...(!!query.t && typeof query.t === 'string' && toTitleCase(query.t) !== 'All' && { t: toTitleCase(query.t) }),
  }
}

const Home: NextPage = () => {
  const { query } = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filter = generateFilter(query)

  const { data: playsCount } = api.play.getCountApproved.useQuery({ filter }, { refetchOnWindowFocus: false })
  const { data: plays } = api.play.getAllApproved.useQuery(
    { currentPage, pageSize, filter },
    { refetchOnWindowFocus: false }
  )

  return (
    <main>
      <PlayListContainer
        title='Playbook'
        plays={plays}
        playsCount={playsCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        displayFilter={true}
      />
      {/* <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Playbook
          </h1>
        </div>

        <form className='flex justify-evenly'>
          {filters.map((filter, idx) => (
            <>
              <select key={idx} {...register(filter.name as keyof FilterForm)}>
                {[filter.plural ?? `All ${filter.name}s`, ...Object.keys(filter.values).filter((e) => e !== 'All')].map(
                  (e, idx) => (
                    <option key={idx}>{e}</option>
                  )
                )}
              </select>
            </>
          ))}
          <button type='button' onClick={onSubmit}>
            Filter Plays
          </button>
        </form>

        {plays && plays.length > 0 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCount={plays.length}
            pageSize={pageSize}
          />
        )}

        <ul className='divide-y'>
          {!plays && 'Loading plays...'}
          {plays && plays.length === 0 && 'No plays found'}
          {plays &&
            plays.length > 0 &&
            plays.map((play, idx) => (
              <PlayContainer key={idx} play={play} youtubeEmbed={'inline'} postButton={false} />
            ))}
        </ul>
      </div> */}
    </main>
  )
}

export default Home
