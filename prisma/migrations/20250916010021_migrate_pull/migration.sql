-- AlterTable
ALTER TABLE `User` ADD COLUMN `activeBoardId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_activeBoardId_fkey` FOREIGN KEY (`activeBoardId`) REFERENCES `Board`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
