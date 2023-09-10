/*
  Warnings:

  - Made the column `expiresAt` on table `BusInsurance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BusInsurance" ALTER COLUMN "expiresAt" SET NOT NULL;
