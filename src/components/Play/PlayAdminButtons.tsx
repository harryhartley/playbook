import type { Play } from '@prisma/client'
import Link from 'next/link'
import type { Dispatch, SetStateAction } from 'react'
import { api } from '../../utils/api'

interface PlayAdminButtonsProps {
  play: Play & { user: { name: string | null } }
  postButton: boolean
  setHidden: Dispatch<SetStateAction<string>>
}

export const PlayAdminButtons = ({ play, postButton, setHidden }: PlayAdminButtonsProps) => {
  const id = play.id

  const approvePlay = api.play.approveById.useMutation()
  const unapprovePlay = api.play.unapproveById.useMutation()
  const archivePlay = api.play.archiveById.useMutation()

  return (
    <>
      <Link
        href={{ pathname: '/submit/[id]', query: { id } }}
        className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800'
      >
        <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
          Edit
        </span>
      </Link>
      {play.approved ? (
        <button
          onClick={() => {
            unapprovePlay.mutate(id)
            setHidden('hidden')
          }}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Unapprove
          </span>
        </button>
      ) : (
        <button
          onClick={() => {
            approvePlay.mutate(id)
            setHidden('hidden')
          }}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Approve
          </span>
        </button>
      )}
      {!play.approved && (
        <button
          onClick={() => {
            archivePlay.mutate(id)
            setHidden('hidden')
          }}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Delete
          </span>
        </button>
      )}
      {play.approved && postButton && (
        <button
          onClick={() => {
            void fetch('/api/postToWebhook', {
              method: 'POST',
              body: JSON.stringify(play),
            })
          }}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-blue-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-green-500 group-hover:to-blue-400 dark:text-white dark:focus:ring-pink-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Post to Discord
          </span>
        </button>
      )}
    </>
  )
}
