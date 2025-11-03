/*
  Warnings:

  - You are about to drop the column `time` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `meetings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meetingFrom` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingTo` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `meetings` DROP FOREIGN KEY `meetings_userId_fkey`;

-- DropIndex
DROP INDEX `meetings_userId_fkey` ON `meetings`;

-- AlterTable
ALTER TABLE `meetings` DROP COLUMN `time`,
    DROP COLUMN `userId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `meetingFrom` DATETIME(3) NOT NULL,
    ADD COLUMN `meetingTo` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `_meetingsTousers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_meetingsTousers_AB_unique`(`A`, `B`),
    INDEX `_meetingsTousers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- AddForeignKey
ALTER TABLE `_meetingsTousers` ADD CONSTRAINT `_meetingsTousers_A_fkey` FOREIGN KEY (`A`) REFERENCES `meetings`(`meetingId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meetingsTousers` ADD CONSTRAINT `_meetingsTousers_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
