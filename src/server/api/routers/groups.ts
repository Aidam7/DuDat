import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  create: publicProcedure
    .input(z.object({ name: z.string(), memberIDs: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
        },
      });
      const data = input.memberIDs.map((id) => ({
        userId: id,
        groupId: group.id,
      }));
      await ctx.prisma.groupMembership.createMany({ data });
    }),
  deleteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
          GroupMembership: {
            some: {
              userId: {
                equals: input.memberId,
              },
            },
          },
        },
      });
    }),
});
