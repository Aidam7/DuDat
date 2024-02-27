import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const leaveGroupInputSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
});

export async function leaveGroup({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: z.infer<typeof leaveGroupInputSchema>;
}) {
  const group = await prisma.group.findFirst({
    where: { id: input.groupId },
  });
  if (!group)
    throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
  if (group.ownerId === input.userId)
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "The Dutchman must have a captain!",
    });
  const deleted = await prisma.groupMembership.deleteMany({
    where: {
      groupId: input.groupId,
      group: {
        isNot: {
          ownerId: input.userId,
        },
      },
      userId: input.userId,
    },
  });
  if (!deleted) return false;
  await prisma.task.updateMany({
    where: {
      groupId: input.groupId,
      authorId: input.userId,
    },
    data: {
      authorId: group.ownerId,
    },
  });
  await prisma.category.updateMany({
    where: {
      groupId: input.groupId,
      authorId: input.userId,
    },
    data: {
      authorId: group.ownerId,
    },
  });
  await prisma.taskAssignment.deleteMany({
    where: {
      userId: input.userId,
      task: {
        groupId: input.groupId,
      },
    },
  });
  return true;
}

export const groupsRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.id,
          groupMembership: {
            some: {
              userId: ctx.session.user.id,
            },
          },
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
      if (!group)
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      if (group.ownerId !== ctx.session.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be owner of the group",
        });
      await ctx.prisma.group.delete({
        where: {
          id: input.id,
        },
      });
    }),
  locateByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findMany({
        where: {
          name: {
            contains: input.name,
          },
          groupMembership: {
            some: {
              userId: {
                equals: ctx.session.user.id,
              },
            },
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
      if (!group)
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      if (group.ownerId !== ctx.session.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be owner of the group",
        });
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
      if (!group)
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      if (group.ownerId !== ctx.session.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be owner of the group",
        });
      if (group.ownerId === input.userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The Dutchman must have a captain!",
        });
      const deleted = await ctx.prisma.groupMembership.deleteMany({
        where: {
          groupId: input.groupId,
          userId: input.userId,
        },
      });
      if (!deleted) return false;
      await ctx.prisma.task.updateMany({
        where: {
          groupId: input.groupId,
          authorId: input.userId,
        },
        data: {
          authorId: group.ownerId,
        },
      });
      await ctx.prisma.category.updateMany({
        where: {
          groupId: input.groupId,
          authorId: input.userId,
        },
        data: {
          authorId: group.ownerId,
        },
      });
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
      if (!group)
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId },
      });
      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      if (group.ownerId !== ctx.session.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be owner of the group",
        });
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
    .input(leaveGroupInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.userId !== ctx.session.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Cannot leave group for another user",
        });
      return leaveGroup({ prisma: ctx.prisma, input });
    }),
});
