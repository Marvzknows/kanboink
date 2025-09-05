-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_assigneeId_fkey`;

-- DropIndex
DROP INDEX `Card_assigneeId_fkey` ON `Card`;

-- AlterTable
ALTER TABLE `Card` MODIFY `assigneeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
