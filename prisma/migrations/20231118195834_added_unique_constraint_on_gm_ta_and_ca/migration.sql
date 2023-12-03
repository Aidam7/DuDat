/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,taskId]` on the table `CategoryAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `GroupMembership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,taskId]` on the table `TaskAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CategoryAssignment_categoryId_taskId_key" ON "CategoryAssignment"("categoryId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembership_userId_groupId_key" ON "GroupMembership"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignment_userId_taskId_key" ON "TaskAssignment"("userId", "taskId");
