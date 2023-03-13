import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

import { api } from '../utils/api'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { LayoutWrapper } from '../components/Site/LayoutWrapper'
import { siteMetadata } from '../data/siteMetadata'
import '../styles/globals.css'

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute='class' defaultTheme={siteMetadata.theme}>
        <Head>
          <meta content='width=device-width, initial-scale=1' name='viewport' />
        </Head>
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
