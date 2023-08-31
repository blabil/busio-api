-- DropForeignKey
ALTER TABLE "BusLineRoute" DROP CONSTRAINT "BusLineRoute_bus_id_fkey";

-- DropForeignKey
ALTER TABLE "BusLineRoute" DROP CONSTRAINT "BusLineRoute_driver_id_fkey";

-- AlterTable
ALTER TABLE "BusLineRoute" ALTER COLUMN "bus_id" DROP NOT NULL,
ALTER COLUMN "driver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BusLineRoute" ADD CONSTRAINT "BusLineRoute_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLineRoute" ADD CONSTRAINT "BusLineRoute_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
