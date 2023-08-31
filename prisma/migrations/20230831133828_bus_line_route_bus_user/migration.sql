/*
  Warnings:

  - Added the required column `bus_id` to the `BusLineRoute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driver_id` to the `BusLineRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusLineRoute" ADD COLUMN     "bus_id" INTEGER NOT NULL,
ADD COLUMN     "driver_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BusLineRoute" ADD CONSTRAINT "BusLineRoute_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLineRoute" ADD CONSTRAINT "BusLineRoute_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
