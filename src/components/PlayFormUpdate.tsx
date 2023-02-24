/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Play } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import type { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { Character, Environment, Speed, Stage, Type } from '../lib/enums'
import { api } from '../utils/api'
import { isUserModeratorOrAbove } from '../utils/auth'
import { validationValues } from '../validation/play'

const renderInput = (
  register: UseFormRegister<PlayForm>,
  errors: FieldErrors,
  label: keyof PlayForm,
  placeholder: string
) => {
  return (
    <div className='-mx-3 mb-2 flex flex-wrap'>
      <div className='w-full px-3'>
        <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' htmlFor={label}>
          {placeholder}
        </label>
        <input
          className={`mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none`}
          id={label}
          type='text'
          aria-invalid={errors[label] ? 'true' : 'false'}
          {...register(label, validationValues.name)}
          placeholder={placeholder}
        />
        {errors[label] && errors[label]?.type === 'required' && (
          <span role='alert' className='text-xs italic text-red-600'>
            {placeholder} is required
          </span>
        )}
        {errors[label] && errors[label]?.type === 'maxLength' && (
          <span role='alert' className='text-xs italic text-red-600'>
            Value exceeds maximum length of {validationValues.name.maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

const renderYoutubeInput = (
  register: UseFormRegister<PlayForm>,
  errors: FieldErrors,
  label: keyof PlayForm,
  placeholder: string
) => {
  return (
    <div className='-mx-3 mb-2 flex flex-wrap'>
      <div className='w-full px-3'>
        <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' htmlFor={label}>
          {placeholder}
        </label>
        <input
          className={`mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none`}
          id={label}
          type='text'
          aria-invalid={errors[label] ? 'true' : 'false'}
          {...register(label, validationValues.youtubeId)}
          placeholder={'https://www.youtube.com/embed/___________'}
        />
        {errors[label] && errors[label]?.type === 'required' && (
          <span role='alert' className='text-xs italic text-red-600'>
            {placeholder} is required
          </span>
        )}
        {errors[label] && errors[label]?.type === 'pattern' && (
          <span role='alert' className='text-xs italic text-red-600'>
            {placeholder} does not match id format
          </span>
        )}
      </div>
    </div>
  )
}

const renderTextArea = (
  register: UseFormRegister<PlayForm>,
  errors: FieldErrors,
  label: keyof PlayForm,
  placeholder: string
) => {
  const validation = validationValues.description
  return (
    <div className='-mx-3 mb-2 flex flex-wrap'>
      <div className='w-full px-3'>
        <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' htmlFor={label}>
          {placeholder}
        </label>
        <textarea
          className='mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
          id={label}
          aria-invalid={errors.name ? 'true' : 'false'}
          {...register(label, validation)}
          placeholder={placeholder}
        />
        {errors[label] && errors[label]?.type === 'required' && (
          <span role='alert' className='text-xs italic text-red-600'>
            {placeholder} is required
          </span>
        )}
        {errors[label] && errors[label]?.type === 'maxLength' && (
          <span role='alert' className='text-xs italic text-red-600'>
            Value exceeds maximum length of {validation.maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

const renderSelect = (register: UseFormRegister<PlayForm>, label: keyof PlayForm, placeholder: string, o: object) => {
  return (
    <div className='mb-6 w-full px-3'>
      <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' htmlFor={placeholder}>
        {placeholder}
      </label>
      <select
        id={label}
        className='block w-full rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
        {...register(label)}
      >
        {Object.keys(o).map((item, idx) => (
          <option value={item} key={`${label}-${idx}`}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}

type PlayForm = Omit<Play, 'id' | 'createdAt' | 'updatedAt'>

interface PlayFormProps {
  playId?: string
}

export const PlayForm = ({ playId }: PlayFormProps) => {
  const { data: session } = useSession()
  const {
    register: r,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PlayForm>()

  const { data: play } = playId ? api.play.getById.useQuery(playId) : { data: {} as Play }
  useEffect(() => {
    setValue('name', play?.name ?? '')
    setValue('youtubeId', play?.youtubeId ?? '')
    setValue('description', play?.description ?? '')
    setValue('type', play?.type ?? 'Bait')
    setValue('speed', play?.speed ?? 'All')
    setValue('environment', play?.environment ?? 'Match')
    setValue('character', play?.character ?? 'All')
    setValue('stage', play?.stage ?? 'All')
    setValue('difficulty', play?.difficulty ?? 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play])

  const createPlay = api.play.create.useMutation()
  const onSubmitCreate: SubmitHandler<PlayForm> = (data) => {
    if (!createPlay.isLoading && session) {
      createPlay.mutate({
        ...data,
        difficulty: Number(data.difficulty),
        userId: session.user.id,
        approved: isUserModeratorOrAbove(session.user.role),
      })
    }
  }

  const updatePlayById = api.play.updateById.useMutation()
  const onSubmitUpdate: SubmitHandler<PlayForm> = (data) => {
    if (!updatePlayById.isLoading && session && playId) {
      updatePlayById.mutate({ id: playId, data: { ...data, difficulty: Number(data.difficulty) } })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(playId ? onSubmitUpdate : onSubmitCreate)}>
        {renderInput(r, errors, 'name', 'Play Title')}
        {renderYoutubeInput(r, errors, 'youtubeId', 'Youtube Embed URL')}
        {renderTextArea(r, errors, 'description', 'Play Description')}
        <div className='-mx-3 mb-2 grid grid-cols-2'>
          {renderSelect(r, 'type', 'Play Type', Type)}
          {renderSelect(r, 'speed', 'Ball Speed', Speed)}
          {renderSelect(r, 'environment', 'Play Environment', Environment)}
          {renderSelect(r, 'character', 'Selected Character', Character)}
          {renderSelect(r, 'stage', 'Selected Stage', Stage)}
          {renderSelect(r, 'difficulty', 'Execution Difficulty', { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5' })}
        </div>
        <input
          className={`mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 hover:border-gray-500 focus:bg-white focus:outline-none`}
          type='submit'
        />
      </form>
    </>
  )
}
