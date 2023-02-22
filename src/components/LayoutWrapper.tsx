import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { headerNavLinks } from "../data/headerNavLinks"
import { siteMetadata } from "../data/siteMetadata"
import { Footer } from "./Footer"
import { MobileNav } from "./MobileNav"
import { ThemeSwitch } from "./ThemeSwitch"

interface LayoutWrapperProps {
  children: JSX.Element
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { data: sessionData } = useSession();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/" aria-label={siteMetadata.title}>
              <div className="flex items-center justify-between">
                {/* <div className="mr-3">
                  <Logo />
                </div> */}
                {typeof siteMetadata.title === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.title}
                  </div>
                ) : (
                  siteMetadata.title
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <button 
              className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4" 
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </div>
  )
}