/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { headerNavLinks } from '../data/headerNavLinks'
import { siteMetadata } from '../data/siteMetadata'
import { isUserContributorOrAbove, isUserModeratorOrAbove } from '../utils/auth'
import { toTitleCase } from '../utils/string'
import { MobileNav } from './MobileNav'
import { ThemeSwitch } from './ThemeSwitch'

export const Header = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id

  return (
    <header className='flex items-center justify-between py-10'>
      <div>
        <Link href='/' aria-label={siteMetadata.title}>
          <div className='flex items-center justify-between'>
            {/* <div className="mr-3">
              <Logo />
            </div> */}
            <div className='hidden h-6 text-2xl font-semibold sm:block'>{siteMetadata.title}</div>
          </div>
        </Link>
      </div>
      <div className='flex items-center text-base leading-5'>
        <div className='hidden sm:block'>
          {headerNavLinks.map((link) => (
            <Link key={link.title} href={link.href} className='p-1 font-medium sm:p-4'>
              {link.title}
            </Link>
          ))}
        </div>

        {sessionData ? (
          <nav
            aria-label='primary'
            className='relative z-20 hidden flex-grow flex-col pb-4 md:flex md:flex-row md:justify-end md:pb-0'
          >
            <div className='group relative'>
              <button className='mt-2 flex w-full flex-row items-center rounded-lg bg-transparent px-4 py-4 text-left text-base font-bold focus:outline-none md:mt-0 md:ml-4 md:inline md:w-auto'>
                <span>
                  {sessionData && (
                    <>
                      <div className='flex items-center'>
                        <div className='p-1 font-medium sm:p-4'>Signed in as {sessionData?.user.name}</div>
                        <img
                          className='h-10 w-10 rounded-full'
                          src={sessionData?.user.image ?? ''}
                          alt='Profile Picture'
                        ></img>
                      </div>
                    </>
                  )}
                </span>
              </button>
              <div className='bg-grey-200 absolute z-10 hidden group-hover:block'>
                <div className='bg-white px-2 pt-2 pb-4 shadow-lg dark:bg-black'>
                  <div className='grid grid-cols-1'>
                    <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/user/[userId]', query: { userId } }}>
                      Profile
                    </Link>
                    <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/bookmarks' }}>
                      Bookmarks
                    </Link>
                    {isUserContributorOrAbove(sessionData.user.role) && (
                      <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/submit' }}>
                        Submit
                      </Link>
                    )}
                    {isUserModeratorOrAbove(sessionData.user.role) && (
                      <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/dashboard' }}>
                        {`${toTitleCase(sessionData.user.role)} Dasboard`}
                      </Link>
                    )}
                    <div className='cursor-pointer p-1 font-medium sm:p-4' onClick={() => void signOut()}>
                      Sign Out
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        ) : (
          <div className='cursor-pointer p-1 font-medium sm:p-4' onClick={() => void signIn()}>
            Sign in
          </div>
        )}

        <ThemeSwitch />

        <MobileNav />
      </div>
    </header>
  )
}
