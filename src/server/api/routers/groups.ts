import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.id,
        },
      });
      return group;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        memberIDs: z.array(z.string()),
        ownerId: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          ownerId: input.ownerId,
          description: input.description,
        },
      });
      const data = input.memberIDs.map((id) => ({
        userId: id,
        groupId: group.id,
      }));
      await ctx.prisma.groupMembership.createMany({ data });
      return group;
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!group) throw new Error("Group not found");
      if (group.ownerId !== ctx.session.user.id)
        throw new Error("You are not the owner of this group");
      await ctx.prisma.group.delete({
        where: {
          id: input.id,
        },
      });
    }),
  locateByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
      });
    }),
  locateByNameAndMember: protectedProcedure
    .input(z.object({ name: z.string(), memberId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findMany({
        where: {
          name: {
            contains: input.name,
          },
          groupMembership: {
            some: {
              userId: {
                equals: input.memberId,
              },
            },
          },
        },
      });
    }),
  edit: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        name: z.string(),
        description: z.string(),
        ownerId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findFirst({
        where: { id: input.groupId },
      });
      if (!group) throw new Error("Group not found");
      if (group.ownerId !== ctx.session.user.id)
        throw new Error("You are not the owner of this group");
      if (!input.ownerId) input.ownerId = group.ownerId;
      return await ctx.prisma.group.update({
        where: {
          id: input.groupId,
        },
        data: {
          name: input.name,
          description: input.description,
          ownerId: input.ownerId,
        },
      });
    }),
  removeMember: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findFirst({
        where: { id: input.groupId },
      });
      if (!group) throw new Error("Group not found");
      if (group.ownerId !== ctx.session.user.id)
        throw new Error("You are not the owner of this group");
      if (group.ownerId === input.userId)
        throw new Error("The Dutchman must have a captain!");
      const deleted = await ctx.prisma.groupMembership.deleteMany({
        where: {
          groupId: input.groupId,
          userId: input.userId,
        },
      });
      if (!deleted) return false;
      await ctx.prisma.taskAssignment.deleteMany({
        where: {
          userId: input.userId,
          task: {
            groupId: input.groupId,
          },
        },
      });
      return true;
    }),
  addMember: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findFirst({
        where: { id: input.groupId },
      });
      if (!group) throw new Error("Group not found");
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId },
      });
      if (!user) throw new Error("User not found");
      if (group.ownerId !== ctx.session.user.id)
        throw new Error("You are not the owner of this group");
      const membership = await ctx.prisma.groupMembership.create({
        data: {
          groupId: input.groupId,
          userId: input.userId,
        },
      });
      if (membership) return true;
      return false;
    }),
  leave: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.prisma.groupMembership.deleteMany({
        where: {
          groupId: input.groupId,
          group: {
            isNot: {
              ownerId: ctx.session.user.id,
            },
          },
          userId: ctx.session.user.id,
        },
      });
      if (!deleted) return false;
      await ctx.prisma.taskAssignment.deleteMany({
        where: {
          userId: ctx.session.user.id,
          task: {
            groupId: input.groupId,
          },
        },
      });
      return true;
    }),
});
