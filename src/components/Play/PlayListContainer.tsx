import type { Play } from '@prisma/client'
import { useRouter } from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { Character, Difficulty, Environment, Speed, Stage, Type } from '../../lib/enums'
import { Pagination } from '../Pagination'
import { PlayContainer } from './PlayContainer'

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

interface PlayListContainerProps {
  title?: string
  plays: (Play & { user: { name: string | null } })[] | undefined
  playsCount: number | undefined
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  pageSize: number
  displayPlayCount?: boolean
  displayFilter?: boolean
}

export const PlayListContainer = ({
  title,
  plays,
  playsCount,
  currentPage,
  setCurrentPage,
  pageSize,
  displayPlayCount = false,
  displayFilter = false,
}: PlayListContainerProps) => {
  const { push } = useRouter()

  const filters: { name: string; values: { [key: string]: string }; plural?: string }[] = [
    { name: 'Character', values: Character },
    { name: 'Type', values: Type },
    { name: 'Speed', values: Speed },
    { name: 'Stage', values: Stage },
    { name: 'Environment', values: Environment },
    { name: 'Difficulty', values: Difficulty, plural: 'All Difficulties' },
  ]
  const { register, getValues } = useForm<FilterForm>({})

  const onSubmit = () => {
    void push(`/playbook${generateFilterString(getValues())}`)
  }

  return (
    <div className='divide-y'>
      {title && (
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            {title}
          </h1>
        </div>
      )}

      {displayPlayCount && (
        <h2 className='md:leading-14 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
          Plays: {playsCount ?? 'loading'}
        </h2>
      )}

      {displayFilter && (
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
      )}

      {plays && playsCount && playsCount > 0 ? (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCount={playsCount}
          pageSize={pageSize}
        />
      ) : null}

      <ul className='divide-y'>
        {!plays
          ? 'Loading plays...'
          : !playsCount || playsCount === 0
          ? 'No plays found'
          : plays.map((play, idx) => (
              <PlayContainer key={idx} play={play} youtubeEmbed={'inline'} postButton={false} />
            ))}
      </ul>
    </div>
  )
}
