/*
  Warnings:

  - You are about to drop the column `ipAddresss` on the `LoginHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LoginHistory" DROP COLUMN "ipAddresss",
ADD COLUMN     "ipAddress" TEXT;
