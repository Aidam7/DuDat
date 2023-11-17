import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  deleteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.id } });
    }),
  locateByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
      });
    }),
  locateByNameAndGroup: protectedProcedure
    .input(z.object({ name: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
          groupMembership: {
            some: {
              groupId: input.groupId,
            },
          },
        },
      });
    }),
  isMemberOfGroup: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await ctx.prisma.groupMembership.findFirst({
        where: {
          userId: input.userId,
          groupId: input.groupId,
        },
      });
      if (membership) return true;
      return false;
    }),
  isOwnerOfGroup: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ownership = await ctx.prisma.group.findFirst({
        where: {
          ownerId: input.userId,
          id: input.groupId,
        },
      });
      if (ownership) return true;
      return false;
    }),
});
