import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.task.findMany();
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
          group: {
            groupMembership: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        include: {
          group: true,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        desc: z.string(),
        parentGroupId: z.string(),
        authorId: z.string(),
        assigneeIDs: z.array(z.string()),
        dueOn: z.date().nullable(),
        startOn: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const groupMembership = await ctx.prisma.groupMembership.findFirst({
        where: {
          groupId: input.parentGroupId,
          userId: ctx.session.user.id,
        },
      });
      if (!groupMembership) throw new Error("Not a member of the group");
      const task = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.desc,
          groupId: input.parentGroupId,
          authorId: input.authorId,
          dueOn: input.dueOn,
          startOn: input.startOn,
        },
      });
      const data = input.assigneeIDs.map((id) => ({
        userId: id,
        taskId: task.id,
      }));
      await ctx.prisma.taskAssignment.createMany({ data });
      return task;
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
          AND: {
            OR: [
              { authorId: ctx.session.user.id },
              { group: { ownerId: ctx.session.user.id } },
            ],
          },
        },
      });
      if (!task) throw new Error("Task not found");
      const groupMembership = await ctx.prisma.groupMembership.findFirst({
        where: {
          groupId: task.groupId,
          userId: ctx.session.user.id,
        },
      });
      if (!groupMembership) throw new Error("Not a member of the group");
      return await ctx.prisma.task.delete({
        where: { id: input.id},
      });
    }),
  locateByName: protectedProcedure
    .input(z.object({ name: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        where: {
          title: {
            contains: input.name,
          },
          groupId: input.groupId,
          group: {
            groupMembership: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        include: {
          group: true,
          taskAssignment: true,
          categories: true,
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
          categories: true,
          taskAssignment: true,
        },
      });
    }),
  isAuthorOrGroupOwner: protectedProcedure
    .input(z.object({ taskId: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
        },
        include: {
          group: true,
        },
      });
      if (!task) throw new Error("Task not found");
      if (
        task.authorId != ctx.session.user.id &&
        task.group.ownerId != ctx.session.user.id &&
        input.userId != ctx.session.user.id
      )
        throw new Error("You are not authorized to perform this action");
      return task ? true : false;
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
      const assignment = await ctx.prisma.taskAssignment.create({
        data: {
          userId: input.userId,
          taskId: input.taskId,
        },
      });
      return assignment ? true : false;
    }),
  unassignUser: protectedProcedure
    .input(z.object({ userId: z.string(), taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: { id: input.taskId },
        include: { group: true },
      });
      if (!task) throw new Error("Task not found");
      if (
        task.authorId != ctx.session.user.id &&
        task.group.ownerId != ctx.session.user.id &&
        input.userId != ctx.session.user.id
      )
        throw new Error("You are not authorized to unassign this user");
      const assignment = await ctx.prisma.taskAssignment.deleteMany({
        where: {
          userId: input.userId,
          taskId: input.taskId,
        },
      });
      return assignment ? true : false;
    }),
  getUnassignedMembers: protectedProcedure
    .input(z.object({ taskId: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const unassignedMembers = await ctx.prisma.user.findMany({
        where: {
          groupMembership: {
            some: {
              groupId: input.groupId,
            },
          },
          taskAssignment: {
            none: {
              taskId: input.taskId,
            },
          },
        },
      });
      return unassignedMembers;
    }),
  getAssignedMembers: protectedProcedure
    .input(z.object({ taskId: z.string(), groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          taskAssignment: {
            some: {
              taskId: input.taskId,
            },
          },
        },
      });
    }),
  getTaskWithGroupId: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          group: {
            groupMembership: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        select: {
          groupId: true,
        },
      });
    }),
  finishTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          taskAssignment: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      if (!task) throw new Error("Task not found");
      return await ctx.prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          finishedOn: new Date(),
        },
      });
    }),
  resumeTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          taskAssignment: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      if (!task) throw new Error("Task not found");
      return await ctx.prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          finishedOn: null,
          confirmedAsFinished: false,
        },
      });
    }),
  confirmTaskAsFinished: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
        },
        include: {
          group: true,
        },
      });
      if (!task) throw new Error("Task not found");
      if (
        task.authorId != ctx.session.user.id &&
        task.group.ownerId != ctx.session.user.id
      )
        throw new Error(
          "You are not authorized to confirm this task as finished",
        );
      let updatedTask;
      if (!task.finishedOn) {
        updatedTask = await ctx.prisma.task.update({
          where: {
            id: input.taskId,
          },
          data: {
            finishedOn: new Date(),
            confirmedAsFinished: true,
          },
        });
      } else {
        updatedTask = await ctx.prisma.task.update({
          where: {
            id: input.taskId,
          },
          data: {
            confirmedAsFinished: true,
          },
        });
      }
      if (!updatedTask.dueOn) {
        await ctx.prisma.user.updateMany({
          where: {
            taskAssignment: {
              some: {
                taskId: input.taskId,
              },
            },
          },
          data: {
            finishedTasksCount: {
              increment: 1,
            },
          },
        });
      } else {
        await ctx.prisma.user.updateMany({
          where: {
            taskAssignment: {
              some: {
                taskId: input.taskId,
              },
            },
          },
          data: {
            [new Date() > updatedTask.dueOn
              ? "finishedTasksLateCount"
              : "finishedTasksCount"]: {
              increment: 1,
            },
          },
        });
      }
      return updatedTask;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        desc: z.string(),
        dueOn: z.date().nullable(),
        startOn: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
        },
        include: {
          group: true,
        },
      });
      if (!task) throw new Error("Task not found");
      if (
        task.authorId != ctx.session.user.id &&
        task.group.ownerId != ctx.session.user.id
      )
        throw new Error("You are not authorized to edit this task");
      return await ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.desc,
          dueOn: input.dueOn,
          startOn: input.startOn,
        },
      });
    }),
  getCategories: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findMany({
        where: {
          categoryAssignment: {
            some: {
              taskId: input.taskId,
            },
          },
        },
      });
    }),
  getUnassignedCategories: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findMany({
        where: {
          categoryAssignment: {
            none: {
              taskId: input.taskId,
            },
          },
        },
      });
    }),
  assignCategory: protectedProcedure
    .input(z.object({ taskId: z.string(), categoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
        },
      });
      if (!task) throw new Error("Task not found");
      const category = await ctx.prisma.category.findFirst({
        where: {
          id: input.categoryId,
        },
      });
      if (!category) throw new Error("Category not found");
      const isMember = await ctx.prisma.groupMembership.findFirst({
        where: {
          userId: ctx.session.user.id,
          groupId: category.groupId,
        },
      });
      if (!isMember) throw new Error("Must be a member of group");
      return await ctx.prisma.categoryAssignment.create({
        data: {
          taskId: input.taskId,
          categoryId: input.categoryId,
        },
      });
    }),
  unassignCategory: protectedProcedure
    .input(z.object({ taskId: z.string(), categoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
        },
      });
      if (!task) throw new Error("Task not found");
      const category = await ctx.prisma.category.findFirst({
        where: {
          id: input.categoryId,
        },
      });
      if (!category) throw new Error("Category not found");
      const isMember = await ctx.prisma.groupMembership.findFirst({
        where: {
          userId: ctx.session.user.id,
          groupId: category.groupId,
        },
      });
      if (!isMember) throw new Error("Must be a member of group");
      return await ctx.prisma.categoryAssignment.deleteMany({
        where: {
          taskId: input.taskId,
          categoryId: input.categoryId,
        },
      });
    }),
});
