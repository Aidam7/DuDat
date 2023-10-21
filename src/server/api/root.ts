import { createTRPCRouter } from "~/server/api/trpc";
import { tasksRouter } from "./routers/tasks";
import { groupsRouter } from "./routers/groups";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
  groups: groupsRouter,
  users: usersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
