/*
  Warnings:

  - You are about to drop the column `user_id` on the `baseWms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "baseWms" DROP CONSTRAINT "baseWms_user_id_fkey";

-- AlterTable
ALTER TABLE "baseWms" DROP COLUMN "user_id";
