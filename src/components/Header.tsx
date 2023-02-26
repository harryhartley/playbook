/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { headerNavLinks } from '../data/headerNavLinks'
import { siteMetadata } from '../data/siteMetadata'
import { isUserContributorOrAbove, isUserModeratorOrAbove } from '../utils/auth'
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
        <ThemeSwitch />
        {sessionData && (
          <>
            <div className='flex items-center'>
              <div className='p-1 font-medium sm:p-4'>Signed in as {sessionData?.user.name}</div>
              <img className='h-10 w-10 rounded-full' src={sessionData?.user.image ?? ''} alt='Profile Picture'></img>
            </div>
            <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/user/[userId]', query: { userId } }}>
              Profile
            </Link>
          </>
        )}
        {sessionData && isUserContributorOrAbove(sessionData.user.role) && (
          <>
            <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/submit' }}>
              Submit
            </Link>
          </>
        )}
        {sessionData && isUserModeratorOrAbove(sessionData.user.role) && (
          <>
            <Link className='p-1 font-medium sm:p-4' href={{ pathname: '/dashboard' }}>
              Dashboard
            </Link>
          </>
        )}
        <button className='p-1 font-medium sm:p-4' onClick={sessionData ? () => void signOut() : () => void signIn()}>
          {sessionData ? 'Sign out' : 'Sign in'}
        </button>
        <MobileNav />
      </div>
    </header>
  )
}
