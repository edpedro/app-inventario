/*
  Warnings:

  - You are about to drop the column `date` on the `baseCiclico` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `baseCiclico` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "baseCiclico" DROP COLUMN "date",
DROP COLUMN "username";
