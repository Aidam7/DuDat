/*
  Warnings:

  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';
