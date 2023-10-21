/*
  Warnings:

  - You are about to drop the column `groupId` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "selectedGroupId" TEXT;
