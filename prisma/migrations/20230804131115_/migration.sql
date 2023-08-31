/*
  Warnings:

  - The primary key for the `BusStopConnection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[busStopFrom_id,busStopTo_id]` on the table `BusStopConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BusStopConnection" DROP CONSTRAINT "BusStopConnection_pkey";

-- CreateTable
CREATE TABLE "BusLineConnection" (
    "order" INTEGER NOT NULL,
    "StopConnection_From" INTEGER NOT NULL,
    "StopConnection_To" INTEGER NOT NULL,
    "busLine_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BusLineConnection_StopConnection_From_StopConnection_To_bus_key" ON "BusLineConnection"("StopConnection_From", "StopConnection_To", "busLine_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusStopConnection_busStopFrom_id_busStopTo_id_key" ON "BusStopConnection"("busStopFrom_id", "busStopTo_id");

-- AddForeignKey
ALTER TABLE "BusLineConnection" ADD CONSTRAINT "BusLineConnection_StopConnection_From_StopConnection_To_fkey" FOREIGN KEY ("StopConnection_From", "StopConnection_To") REFERENCES "BusStopConnection"("busStopFrom_id", "busStopTo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLineConnection" ADD CONSTRAINT "BusLineConnection_busLine_id_fkey" FOREIGN KEY ("busLine_id") REFERENCES "BusLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
