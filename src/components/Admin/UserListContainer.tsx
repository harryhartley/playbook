import type { User } from '@prisma/client'
import type { Dispatch, SetStateAction } from 'react'
import { Pagination } from '../Pagination'
import { UserContainer } from './UserContainer'

interface UserListContainerProps {
  title?: string
  users: User[] | undefined
  usersCount: number | undefined
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  pageSize: number
}

export const UserListContainer = ({
  title,
  users,
  usersCount,
  currentPage,
  setCurrentPage,
  pageSize,
}: UserListContainerProps) => {
  return (
    <div className='divide-y'>
      {title && (
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            {title}
          </h1>
        </div>
      )}

      <h2 className='md:leading-14 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
        Users: {usersCount ?? 'loading'}
      </h2>

      {users && usersCount && usersCount > 0 ? (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCount={usersCount}
          pageSize={pageSize}
        />
      ) : null}

      <ul className='divide-y'>
        {!users
          ? 'Loading users...'
          : !usersCount || usersCount === 0
          ? 'No users found'
          : users.map((user, idx) => <UserContainer key={idx} user={user} />)}
      </ul>
    </div>
  )
}
