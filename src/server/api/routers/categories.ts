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
      if (!isMember) throw new Error("Not a member of this group");
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
      if (!task) throw new Error("Task not found");
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
      if (!category) throw new Error("Category not found");
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
});
