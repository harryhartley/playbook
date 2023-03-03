/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Play } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import type { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { Character, Environment, Speed, Stage, Type } from '../lib/enums'
import { api } from '../utils/api'
import { isUserModeratorOrAbove } from '../utils/auth'
import { validationValues } from '../validation/play'
import { PlayCard } from './PlayCard'

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
  const router = useRouter()

  const {
    register: r,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PlayForm>()

  api.play.getById.useQuery(playId as string, {
    enabled: !!playId,
    onSuccess(data) {
      data && setValue('name', data.name)
      data && setValue('youtubeId', data.youtubeId)
      data && setValue('description', data.description)
      data && setValue('type', data.type)
      data && setValue('speed', data.speed)
      data && setValue('environment', data.environment)
      data && setValue('character', data.character)
      data && setValue('stage', data.stage)
      data && setValue('difficulty', data.difficulty)
    },
    refetchOnWindowFocus: false,
  })

  const createPlay = api.play.create.useMutation({
    onSuccess() {
      void router.push('/')
    },
  })
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

  const updatePlayById = api.play.updateById.useMutation({
    onSuccess() {
      void router.push('/')
    },
  })
  const onSubmitUpdate: SubmitHandler<PlayForm> = (data) => {
    if (!updatePlayById.isLoading && session && playId) {
      updatePlayById.mutate({ id: playId, data: { ...data, difficulty: Number(data.difficulty) } })
    }
  }

  return (
    <>
      <h1 className='md:leading-14 mb-4 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
        Play Submission Form
      </h1>
      <form className='mb-10' onSubmit={handleSubmit(playId ? onSubmitUpdate : onSubmitCreate)}>
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
      {session && (
        <>
          <h1 className='md:leading-14 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
            Play Preview
          </h1>
          <PlayCard
            play={{
              id: '',
              createdAt: new Date(),
              updatedAt: new Date(),
              userId: session.user.id,
              approved: false,
              name: watch('name'),
              youtubeId: '',
              description: watch('description'),
              type: watch('type'),
              speed: watch('speed'),
              environment: watch('environment'),
              character: watch('character'),
              difficulty: parseInt(watch('difficulty').toString()),
              stage: watch('stage'),
            }}
            displayBookmark={false}
          />
        </>
      )}
    </>
  )
}
