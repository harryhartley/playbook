import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { headerNavLinks } from '../data/headerNavLinks'
import { siteMetadata } from '../data/siteMetadata'
import { MobileNav } from './MobileNav'
import { ThemeSwitch } from './ThemeSwitch'

export const Header = () => {
  const { data: sessionData } = useSession();
  
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.title}>
          <div className="flex items-center justify-between">
            {/* <div className="mr-3">
              <Logo />
            </div> */}
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.title}
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center text-base leading-5">
        <div className="hidden sm:block">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="p-1 font-medium sm:p-4"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <ThemeSwitch />
        <button 
          className="p-1 font-medium sm:p-4" 
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
        <MobileNav />
      </div>
    </header>
  )
}