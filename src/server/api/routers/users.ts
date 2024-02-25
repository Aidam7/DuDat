import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { leaveGroup } from "./groups";

export const usersRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  getByIdExtended: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
        include: {
          groupOwnership: true,
          groupMembership: true,
          taskOwnership: true,
          categoryOwnership: true,
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
      const groups = await ctx.prisma.group.findMany({
        where: { groupMembership: { some: { userId: ctx.session.user.id } } },
      });
      const groupsMemberOf = groups.filter(
        (group) => group.ownerId !== ctx.session.user.id,
      );
      const groupsOwned = groups.filter(
        (group) => group.ownerId === ctx.session.user.id,
      );
      if (groupsOwned.length > 0)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete user with group ownership",
        });
      for (const group of groupsMemberOf) {
        const left = await leaveGroup({
          prisma: ctx.prisma,
          input: { groupId: group.id, userId: ctx.session.user.id },
        });
        if (!left)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to leave group",
          });
      }
      const deletedUser = await ctx.prisma.user.delete({
        where: {
          id: input.id,
          groupOwnership: { none: {} },
          taskOwnership: { none: {} },
          categoryOwnership: { none: {} },
        },
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
