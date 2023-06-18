/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Play } from '@prisma/client'
import { Character, Environment, Speed, Stage, Type } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { api } from '../../utils/api'
import { PlayData } from '../Play/PlayData'
import { TagDropdown } from './TagDropdown'
import { TextArea } from './TextArea'
import { TextInput } from './TextInput'
import { YoutubeTextInput } from './YoutubeTextInput'

export type PlayForm = Omit<Play, 'id' | 'createdAt' | 'updatedAt'>

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
      data && setValue('videoEmbedUrl', data.videoEmbedUrl)
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
        gameAbbr: 'llb',
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
        <TextInput register={r} errors={errors} label='name' placeholder='Play Title' />
        <YoutubeTextInput register={r} errors={errors} label='videoEmbedUrl' placeholder='Video Embed URL' />
        <TextArea register={r} errors={errors} label='description' placeholder='Play Description' />
        <div className='-mx-3 mb-2 grid grid-cols-2'>
          <TagDropdown register={r} label='character' placeholder='Character' o={Character} />
          <TagDropdown register={r} label='type' placeholder='Play Type' o={Type} />
          <TagDropdown register={r} label='speed' placeholder='Ball Speed' o={Speed} />
          <TagDropdown register={r} label='stage' placeholder='Stage' o={Stage} />
          <TagDropdown register={r} label='environment' placeholder='Play Environment' o={Environment} />
          <TagDropdown
            register={r}
            label='difficulty'
            placeholder='Execution Difficulty'
            o={{ '1': '1', '2': '2', '3': '3', '4': '4', '5': '5' }}
          />
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
          <PlayData
            play={{
              id: '',
              createdAt: new Date(),
              updatedAt: new Date(),
              user: { name: session.user.name ?? '' },
              userId: session.user.id,
              gameId: null,
              approved: false,
              archived: false,
              name: watch('name'),
              videoEmbedUrl: '',
              description: watch('description'),
              type: watch('type'),
              speed: watch('speed'),
              environment: watch('environment'),
              character: watch('character'),
              difficulty: parseInt((watch('difficulty') || '1').toString()),
              stage: watch('stage'),
              bookmarks: [],
            }}
            displayBookmark={false}
          />
        </>
      )}
    </>
  )
}
