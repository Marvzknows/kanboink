/*
  Warnings:

  - You are about to drop the column `activeBoardId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_activeBoardId_fkey`;

-- DropIndex
DROP INDEX `User_activeBoardId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `activeBoardId`;
