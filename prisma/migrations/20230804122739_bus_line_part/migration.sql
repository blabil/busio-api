/*
  Warnings:

  - Added the required column `part` to the `BusLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusLine" ADD COLUMN     "part" TEXT NOT NULL;
