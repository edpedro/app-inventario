/*
  Warnings:

  - Added the required column `user_id` to the `baseWms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "baseWms" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "baseWms" ADD CONSTRAINT "baseWms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
