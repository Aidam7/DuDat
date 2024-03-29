import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { generateAvatar } from "~/utils/func";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    createUser: async ({ user }) => {
      //* For some reason TS doesn't recognize that name really does exist after the first check, so, whatever, we check twice
      if (!user.name) return;
      const name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
      if (env.IMAGE_API !== "") {
        user = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: name,
            image: env.IMAGE_API,
          },
        });
      } else {
        const avatar = await generateAvatar(user.id);
        user = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: name,
            image: avatar,
          },
        });
      }
      if (!user.name) return;
      const group = await prisma.group.create({
        data: {
          name: `${user.name}'s Group`,
          ownerId: user.id,
          description: `You personal group, ${user.name}!`,
        },
      });
      await prisma.groupMembership.create({
        data: {
          groupId: group.id,
          userId: user.id,
        },
      });
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
