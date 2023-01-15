/*
  Warnings:

  - Added the required column `centro` to the `baseCiclico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "baseCiclico" ADD COLUMN     "centro" TEXT NOT NULL,
ALTER COLUMN "saldoFisico" SET DEFAULT 0;
