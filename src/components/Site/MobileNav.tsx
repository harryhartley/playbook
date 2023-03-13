import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { headerNavLinks } from '../../data/headerNavLinks'
import { isUserContributorOrAbove, isUserModeratorOrAbove } from '../../utils/auth'
import { toTitleCase } from '../../utils/string'

export const MobileNav = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id

  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className='sm:hidden'>
      <button type='button' className='ml-1 mr-1 h-8 w-8 rounded py-1' aria-label='Toggle Menu' onClick={onToggleNav}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
          <path
            fillRule='evenodd'
            d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          />
        </svg>
      </button>
      <div
        className={`fixed top-0 left-0 z-10 h-full w-full transform bg-gray-200 opacity-95 duration-300 ease-in-out dark:bg-gray-800 ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex justify-end'>
          <button type='button' className='mr-5 mt-11 h-8 w-8 rounded' aria-label='Toggle Menu' onClick={onToggleNav}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='text-gray-900 dark:text-gray-100'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
        <nav className='fixed mt-8 h-full'>
          {[...[{ href: '/', title: 'Home' }], ...headerNavLinks].map((link) => (
            <div key={link.title} className='px-12 py-4'>
              <Link
                href={link.href}
                className='text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100'
                onClick={onToggleNav}
              >
                {link.title}
              </Link>
            </div>
          ))}
          {sessionData && (
            <>
              <div key={'Profile'} className='px-12 py-4'>
                <Link
                  href={{ pathname: '/user/[userId]', query: { userId } }}
                  className='text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100'
                  onClick={onToggleNav}
                >
                  Profile
                </Link>
              </div>
              <div key={'Bookmarks'} className='px-12 py-4'>
                <Link
                  href={{ pathname: '/bookmarks' }}
                  className='text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100'
                  onClick={onToggleNav}
                >
                  Bookmarks
                </Link>
              </div>
              {isUserContributorOrAbove(sessionData.user.role) && (
                <div key={'Submit'} className='px-12 py-4'>
                  <Link
                    href={{ pathname: '/submit' }}
                    className='text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100'
                    onClick={onToggleNav}
                  >
                    Submit
                  </Link>
                </div>
              )}
              {isUserModeratorOrAbove(sessionData.user.role) && (
                <div key={'Dashboard'} className='px-12 py-4'>
                  <Link
                    href={{ pathname: '/dashboard' }}
                    className='text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100'
                    onClick={onToggleNav}
                  >
                    {`${toTitleCase(sessionData.user.role)} Dasboard`}
                  </Link>
                </div>
              )}
              <div className='px-12 py-4'>
                <div
                  className='text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100'
                  onClick={() => void signOut()}
                >
                  Sign Out
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
