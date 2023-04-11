import { Character, Environment, Speed, Stage, Type } from '@prisma/client'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

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

interface PlayFiltersProps {
  gameAbbr?: string
}

export const PlayFilters = ({ gameAbbr }: PlayFiltersProps) => {
  const { push } = useRouter()

  const filters: { name: string; values: { [key: string]: string }; plural?: string }[] = [
    { name: 'Character', values: Character },
    { name: 'Type', values: Type },
    { name: 'Speed', values: Speed },
    { name: 'Stage', values: Stage },
    { name: 'Environment', values: Environment },
    { name: 'Difficulty', values: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5' }, plural: 'All Difficulties' },
  ]

  const { register, getValues } = useForm<FilterForm>({})

  const onSubmit = () => {
    void push(`${gameAbbr ? `/${gameAbbr}` : ''}/playbook${generateFilterString(getValues())}`)
  }

  return (
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
  )
}
