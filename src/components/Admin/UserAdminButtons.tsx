import type { User } from '@prisma/client'
import { Role } from '@prisma/client'
import { api } from '../../utils/api'
import { demoteRole, promoteRole } from '../../utils/role'

interface UserAdminButtonsProps {
  user: User
}

export const UserAdminButtons = ({ user }: UserAdminButtonsProps) => {
  const id = user.id

  const banUser = api.user.banUserById.useMutation()
  const unbanUser = api.user.unbanUserById.useMutation()
  const assignRole = api.user.assignRoleById.useMutation()

  return (
    <>
      {user.banned ? (
        <button
          onClick={() => unbanUser.mutate(id)}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Unban
          </span>
        </button>
      ) : (
        <button
          onClick={() => banUser.mutate(id)}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Ban
          </span>
        </button>
      )}
      {user.role !== Role.ADMIN && (
        <button
          onClick={() => {
            assignRole.mutate({ id, role: promoteRole(user.role) })
          }}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-blue-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-green-500 group-hover:to-blue-400 dark:text-white dark:focus:ring-pink-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            {`Promote to ${promoteRole(user.role)}`}
          </span>
        </button>
      )}
      {user.role !== Role.USER && (
        <button
          onClick={() => {
            assignRole.mutate({ id, role: demoteRole(user.role) })
          }}
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-blue-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-green-500 group-hover:to-blue-400 dark:text-white dark:focus:ring-pink-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            {`Demote to ${demoteRole(user.role)}`}
          </span>
        </button>
      )}
    </>
  )
}
