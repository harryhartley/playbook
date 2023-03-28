import type { User } from '@prisma/client'
import { UserAdminButtons } from './UserAdminButtons'
import { UserData } from './UserData'

interface UserContainerProps {
  user: User
}

export const UserContainer = ({ user }: UserContainerProps) => {
  return (
    <li className={`py-6`}>
      <article>
        <div className='space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0'>
          <div className='space-y-2 xl:col-span-2'>
            <UserData user={user} />
            <UserAdminButtons user={user} />
          </div>
        </div>
      </article>
    </li>
  )
}
