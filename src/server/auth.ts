import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth'
import type { DiscordProfile } from 'next-auth/providers/discord'
import DiscordProvider from 'next-auth/providers/discord'
import { env } from '../env.mjs'
import { prisma } from './db'

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Profile extends DiscordProfile {}

  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      // ...other properties
    } & DefaultSession['user']
  }

  interface User {
    role: string
    // ...other properties
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session
    },
    async signIn({ user, profile }) {
      console.log(profile)
      await prisma.user.update({
        where: { id: user.id },
        data: { name: profile?.username, image: profile?.image_url },
      })
      return true
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    // signIn: '/auth/signin',
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
