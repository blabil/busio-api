/*
  Warnings:

  - Added the required column `title` to the `BusBreakDown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusBreakDown" ADD COLUMN     "title" TEXT NOT NULL;
