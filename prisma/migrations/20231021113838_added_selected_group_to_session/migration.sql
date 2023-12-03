/*
  Warnings:

  - You are about to drop the column `desccription` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskAssignemt" DROP CONSTRAINT "TaskAssignemt_taskId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "groupId" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "desccription",
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "Group_name_idx" ON "Group"("name");

-- AddForeignKey
ALTER TABLE "TaskAssignemt" ADD CONSTRAINT "TaskAssignemt_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
