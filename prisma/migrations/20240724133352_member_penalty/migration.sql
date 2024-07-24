/*
  Warnings:

  - You are about to drop the column `code` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `member` table. All the data in the column will be lost.
  - Added the required column `penalty_date` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "member" DROP COLUMN "code",
ADD COLUMN     "penalty_date" TIMESTAMP(3) NOT NULL;
