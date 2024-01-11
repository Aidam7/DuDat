-- AlterTable
ALTER TABLE "User" ADD COLUMN     "finishedTasksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finishedTasksLateCount" INTEGER NOT NULL DEFAULT 0;
