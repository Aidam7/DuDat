import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot delete other users",
        });
      const groupsOwned = await ctx.prisma.group.findMany({
        where: { ownerId: input.id },
      });
      if (groupsOwned.length > 0)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete user with group ownership",
        });
      const categoriesOwned = await ctx.prisma.category.findMany({
        where: { authorId: input.id },
      });
      const tasksOwned = await ctx.prisma.task.findMany({
        where: { authorId: input.id },
      });
      if (tasksOwned.length > 0)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete user with task ownership",
        });
      if (categoriesOwned.length > 0)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete user with category ownership",
        });
      const deletedUser = await ctx.prisma.user.delete({
        where: { id: input.id },
      });
      return deletedUser ? true : false;
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
  getAllWhereNotMemberOfGroup: protectedProcedure
    .input(z.object({ groupId: z.string(), userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          groupMembership: {
            none: {
              groupId: input.groupId,
            },
          },
          name: {
            contains: input.userName,
          },
        },
      });
    }),
  editName: protectedProcedure
    .input(z.object({ userId: z.string(), newName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id != input.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot edit other users",
        });
      return await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { name: input.newName },
      });
    }),
});
