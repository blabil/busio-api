/*
  Warnings:

  - Added the required column `fullTime` to the `BusLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusLine" ADD COLUMN     "fullTime" INTEGER NOT NULL;
