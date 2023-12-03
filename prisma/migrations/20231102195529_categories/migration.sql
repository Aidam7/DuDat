-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_groupId_fkey";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryAssignment" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "CategoryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_authorId_idx" ON "Category"("authorId");

-- CreateIndex
CREATE INDEX "CategoryAssignment_categoryId_idx" ON "CategoryAssignment"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryAssignment_taskId_idx" ON "CategoryAssignment"("taskId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAssignment" ADD CONSTRAINT "CategoryAssignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAssignment" ADD CONSTRAINT "CategoryAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
