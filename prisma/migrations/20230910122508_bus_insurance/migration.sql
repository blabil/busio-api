-- CreateTable
CREATE TABLE "BusInsurance" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "price" BOOLEAN NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "BusInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusInsurance_id_key" ON "BusInsurance"("id");

-- AddForeignKey
ALTER TABLE "BusInsurance" ADD CONSTRAINT "BusInsurance_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusInsurance" ADD CONSTRAINT "BusInsurance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
