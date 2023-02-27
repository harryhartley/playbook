import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import { useState } from 'react'
import { Pagination } from '../components/Pagination'
import { Play } from '../components/Play'
import { api } from '../utils/api'
import { toTitleCase } from '../utils/string'

// const FilterDropdown = ({ filter }: { filter: { name: string; values:  } }) => {
//   return (
//     <div className='flex flex-col'>
//       <div>{filter.name}</div>
//       <div>
//         {filter.values.values().map((value, idx) => (
//           <div key={idx}>{value}</div>
//         ))}
//       </div>
//     </div>
//   )
// }

const generateFilter = (query: ParsedUrlQuery) => {
  return {
    ...(!!query.c && typeof query.c === 'string' && toTitleCase(query.c) !== 'All' && { c: toTitleCase(query.c) }),
    ...(!!query.d && typeof query.d === 'number' && query.d >= 1 && query.d <= 5 && { d: Math.floor(query.d) }),
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

  const { data: playCount } = api.play.getCountApproved.useQuery()
  const { data: plays } = api.play.getAllApproved.useQuery({ currentPage, pageSize, filter })

  // const filters = [
  //   { name: 'Character', values: Character },
  //   { name: 'Type', values: Type },
  //   { name: 'Stage', values: Stage },
  // ]

  return (
    <main>
      <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Playbook
          </h1>
        </div>

        {/* filter! */}
        {/* <div className='flex justify-center gap-4'>
          {filters.map((filter, idx) => (
            <FilterDropdown filter={filter} key={idx} />
          ))}
        </div> */}

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
