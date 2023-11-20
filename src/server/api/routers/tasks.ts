import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.task.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        desc: z.string(),
        parentGroupId: z.string(),
        authorId: z.string(),
        assigneeIDs: z.array(z.string()),
        dueOn: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.desc,
          groupId: input.parentGroupId,
          authorId: input.authorId,
          dueOn: input.dueOn,
        },
      });
      const data = input.assigneeIDs.map((id) => ({
        userId: id,
        taskId: task.id,
      }));
      await ctx.prisma.taskAssignment.createMany({ data });
      return task;
    }),
  deleteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.delete({ where: { id: input.id } });
    }),
  locateByName: publicProcedure
    .input(z.object({ name: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        where: {
          title: {
            contains: input.name,
          },
          groupId: input.groupId,
        },
        include: {
          group: true,
        },
      });
    }),
  locateByAssigneeAndTitle: protectedProcedure
    .input(z.object({ assigneeId: z.string(), title: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        where: {
          title: {
            contains: input.title,
          },
          taskAssignment: {
            some: {
              userId: {
                equals: input.assigneeId,
              },
            },
          },
        },
        include: {
          group: true,
        },
      });
    }),
  assignUser: protectedProcedure
    .input(z.object({ userId: z.string(), taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: { id: input.taskId },
      });
      if (!task) throw new Error("Task not found");
      const groupMembership = await ctx.prisma.groupMembership.findFirst({
        where: {
          userId: input.userId,
          groupId: task.groupId,
        },
      });
      if (!groupMembership)
        throw new Error("User is not a member of the group");
      const taskAssignment = await ctx.prisma.taskAssignment.create({
        data: {
          userId: input.userId,
          taskId: input.taskId,
        },
      });
      return taskAssignment ? true : false;
    }),
});
