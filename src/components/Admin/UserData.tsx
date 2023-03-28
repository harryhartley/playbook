/* eslint-disable @typescript-eslint/no-extra-semi */
import type { User } from '@prisma/client'
import Link from 'next/link'
import { formatDate } from '../../utils/date'

interface UserDataProps {
  user: User
}

export const UserData = ({ user }: UserDataProps) => {
  const userId = user.id

  return (
    <div className='space-y-2'>
      <div>
        <h2 className='text-2xl font-bold leading-8 tracking-tight'>
          <p className='text-base font-medium leading-6 text-gray-500'>
            <time dateTime={formatDate(user.createdAt)}>{formatDate(user.createdAt)}</time>
          </p>
          <div className='flex items-center gap-4'>
            <Link href={{ pathname: '/user/[userId]', query: { userId } }}>
              {user.name} - {user.role}
            </Link>
          </div>
        </h2>
      </div>
    </div>
  )
}
