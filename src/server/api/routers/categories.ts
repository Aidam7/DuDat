import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findFirst({
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
        name: z.string(),
        description: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isMember = await ctx.prisma.groupMembership.findFirst({
        where: {
          userId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });
      if (!isMember)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be a member of group",
        });
      return await ctx.prisma.category.create({
        data: {
          name: input.name,
          description: input.description,
          authorId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.category.delete({
        where: {
          id: input.id,
          OR: [
            { authorId: ctx.session.user.id },
            { group: { ownerId: ctx.session.user.id } },
          ],
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.category.update({
        where: {
          id: input.id,
          OR: [
            { authorId: ctx.session.user.id },
            { group: { ownerId: ctx.session.user.id } },
          ],
        },
        data: { name: input.name, description: input.description },
      });
    }),
  addCategoryToTask: protectedProcedure
    .input(z.object({ taskId: z.string(), categoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          authorId: ctx.session.user.id,
        },
      });
      if (!task)
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      const category = await ctx.prisma.category.findFirst({
        where: {
          id: input.categoryId,
          group: {
            groupMembership: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
      if (!category)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      return await ctx.prisma.categoryAssignment.create({
        data: {
          taskId: input.taskId,
          categoryId: input.categoryId,
        },
      });
    }),
  removeCategoryFromTask: protectedProcedure
    .input(z.object({ taskId: z.string(), categoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.categoryAssignment.deleteMany({
        where: {
          taskId: input.taskId,
          categoryId: input.categoryId,
        },
      });
    }),
  getTasks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        where: {
          categories: {
            some: {
              categoryId: input.id,
            },
          },
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
  getByGroup: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findMany({
        where: {
          group: {
            id: input.groupId,
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
});
