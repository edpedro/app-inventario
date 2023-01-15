/*
  Warnings:

  - Added the required column `dateCiclico` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateSap` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateWms` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usernameCiclico` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usernameSap` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usernameWms` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "baseCiclico" ADD COLUMN     "dateCiclico" TEXT NOT NULL,
ADD COLUMN     "dateSap" TEXT NOT NULL,
ADD COLUMN     "dateWms" TEXT NOT NULL,
ADD COLUMN     "usernameCiclico" TEXT NOT NULL,
ADD COLUMN     "usernameSap" TEXT NOT NULL,
ADD COLUMN     "usernameWms" TEXT NOT NULL;
