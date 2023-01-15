/*
  Warnings:

  - Added the required column `username` to the `baseWms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "baseWms" ADD COLUMN     "username" TEXT NOT NULL;
