import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pagination } from '../components/Pagination'
import { Play } from '../components/Play'
import { Character, Environment, Speed, Stage, Type } from '../lib/enums'
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

const generateFilterString = (filterValues: FilterForm) => {
  return `?${!filterValues.Character.startsWith('All ') ? `c=${filterValues.Character}` : ''}${
    !filterValues.Type.startsWith('All ') ? `&t=${filterValues.Type}` : ''
  }${!filterValues.Speed.startsWith('All ') ? `&sp=${filterValues.Speed}` : ''}${
    !filterValues.Stage.startsWith('All ') ? `&st=${filterValues.Stage}` : ''
  }${!filterValues.Environment.startsWith('All ') ? `&e=${filterValues.Environment}` : ''}${
    !filterValues.Difficulty.startsWith('All ') ? `&d=${filterValues.Difficulty}` : ''
  }`
}

type FilterForm = {
  Character: string
  Type: string
  Speed: string
  Stage: string
  Environment: string
  Difficulty: string
}

const Home: NextPage = () => {
  const { query, push } = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filter = generateFilter(query)

  const { data: playCount } = api.play.getCountApproved.useQuery(undefined, { refetchOnWindowFocus: false })
  const { data: plays } = api.play.getAllApproved.useQuery(
    { currentPage, pageSize, filter },
    { refetchOnWindowFocus: false }
  )

  const filters: { name: string; values: { [key: string]: string }; plural?: string }[] = [
    { name: 'Character', values: Character },
    { name: 'Type', values: Type },
    { name: 'Speed', values: Speed },
    { name: 'Stage', values: Stage },
    { name: 'Environment', values: Environment },
    { name: 'Difficulty', values: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5' }, plural: 'All Difficulties' },
  ]
  const { register, getValues } = useForm<FilterForm>({})
  const onSubmit = () => void push(`/playbook${generateFilterString(getValues())}`)

  return (
    <main>
      <div className='divide-y'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            Playbook
          </h1>
        </div>

        {/* filter! */}
        <form className='my-2 flex justify-evenly'>
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
