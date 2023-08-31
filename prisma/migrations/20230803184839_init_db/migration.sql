-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'DRIVER', 'MECHANIC', 'ADMIN');

-- CreateEnum
CREATE TYPE "BusState" AS ENUM ('AVAIABLE', 'UNAVAIABLE', 'BROKEN');

-- CreateEnum
CREATE TYPE "BusEngine" AS ENUM ('ELECTRIC', 'DIESEL');

-- CreateEnum
CREATE TYPE "BusRepairState" AS ENUM ('SOLVED', 'UNSOLVED', 'UNDER_REPAIR');

-- CreateEnum
CREATE TYPE "BusLineRouteTime" AS ENUM ('FULL', 'HALF');

-- CreateEnum
CREATE TYPE "BusLineRouteType" AS ENUM ('MONFRI', 'WEEK', 'WEEKEND', 'SPECIAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" SERIAL NOT NULL,
    "registration" TEXT NOT NULL,
    "state" "BusState" NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusProfile" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "productionYear" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "engine" "BusEngine" NOT NULL,
    "bus_id" INTEGER NOT NULL,

    CONSTRAINT "BusProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusIssue" (
    "id" SERIAL NOT NULL,
    "state" "BusRepairState" NOT NULL DEFAULT 'UNSOLVED',
    "desc" TEXT NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solvedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusIssueModify" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,
    "busIssue_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "modifyAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusIssueModify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusBreakDown" (
    "id" SERIAL NOT NULL,
    "state" "BusRepairState" NOT NULL DEFAULT 'UNSOLVED',
    "desc" TEXT NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solvedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusBreakDown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusBreakDownModify" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,
    "BusBreakDown_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "modifyAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusBreakDownModify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusReview" (
    "id" SERIAL NOT NULL,
    "additionalInfo" TEXT NOT NULL,
    "isActuall" BOOLEAN NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusLine" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "BusLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusStop" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BusStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusLineStop" (
    "busLine_id" INTEGER NOT NULL,
    "busStop_id" INTEGER NOT NULL,

    CONSTRAINT "BusLineStop_pkey" PRIMARY KEY ("busLine_id","busStop_id")
);

-- CreateTable
CREATE TABLE "BusStopConnection" (
    "time" INTEGER NOT NULL DEFAULT 0,
    "busStopFrom_id" INTEGER NOT NULL,
    "busStopTo_id" INTEGER NOT NULL,

    CONSTRAINT "BusStopConnection_pkey" PRIMARY KEY ("busStopFrom_id","busStopTo_id")
);

-- CreateTable
CREATE TABLE "BusLineRoute" (
    "id" SERIAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "time" "BusLineRouteTime" NOT NULL,
    "type" "BusLineRouteType" NOT NULL,
    "busLine_id" INTEGER NOT NULL,

    CONSTRAINT "BusLineRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_id_key" ON "Bus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_registration_key" ON "Bus"("registration");

-- CreateIndex
CREATE INDEX "bus_id" ON "Bus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusProfile_id_key" ON "BusProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusProfile_bus_id_key" ON "BusProfile"("bus_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusIssue_id_key" ON "BusIssue"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusIssue_bus_id_key" ON "BusIssue"("bus_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusIssue_user_id_key" ON "BusIssue"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusIssueModify_id_key" ON "BusIssueModify"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusIssueModify_busIssue_id_key" ON "BusIssueModify"("busIssue_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusIssueModify_user_id_key" ON "BusIssueModify"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusBreakDown_id_key" ON "BusBreakDown"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusBreakDown_user_id_key" ON "BusBreakDown"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusBreakDownModify_id_key" ON "BusBreakDownModify"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusBreakDownModify_BusBreakDown_id_key" ON "BusBreakDownModify"("BusBreakDown_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusBreakDownModify_user_id_key" ON "BusBreakDownModify"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusReview_id_key" ON "BusReview"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusReview_bus_id_key" ON "BusReview"("bus_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusReview_user_id_key" ON "BusReview"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusLine_id_key" ON "BusLine"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusLine_number_key" ON "BusLine"("number");

-- CreateIndex
CREATE UNIQUE INDEX "BusStop_address_key" ON "BusStop"("address");

-- CreateIndex
CREATE UNIQUE INDEX "BusLineStop_busLine_id_key" ON "BusLineStop"("busLine_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusLineStop_busStop_id_key" ON "BusLineStop"("busStop_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusStopConnection_busStopFrom_id_key" ON "BusStopConnection"("busStopFrom_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusStopConnection_busStopTo_id_key" ON "BusStopConnection"("busStopTo_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusLineRoute_id_key" ON "BusLineRoute"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusLineRoute_busLine_id_key" ON "BusLineRoute"("busLine_id");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusProfile" ADD CONSTRAINT "BusProfile_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusIssue" ADD CONSTRAINT "BusIssue_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusIssue" ADD CONSTRAINT "BusIssue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusIssueModify" ADD CONSTRAINT "BusIssueModify_busIssue_id_fkey" FOREIGN KEY ("busIssue_id") REFERENCES "BusIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusIssueModify" ADD CONSTRAINT "BusIssueModify_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusBreakDown" ADD CONSTRAINT "BusBreakDown_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusBreakDown" ADD CONSTRAINT "BusBreakDown_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusBreakDownModify" ADD CONSTRAINT "BusBreakDownModify_BusBreakDown_id_fkey" FOREIGN KEY ("BusBreakDown_id") REFERENCES "BusBreakDown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusBreakDownModify" ADD CONSTRAINT "BusBreakDownModify_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusReview" ADD CONSTRAINT "BusReview_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusReview" ADD CONSTRAINT "BusReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLineStop" ADD CONSTRAINT "BusLineStop_busLine_id_fkey" FOREIGN KEY ("busLine_id") REFERENCES "BusLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLineStop" ADD CONSTRAINT "BusLineStop_busStop_id_fkey" FOREIGN KEY ("busStop_id") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopConnection" ADD CONSTRAINT "BusStopConnection_busStopFrom_id_fkey" FOREIGN KEY ("busStopFrom_id") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopConnection" ADD CONSTRAINT "BusStopConnection_busStopTo_id_fkey" FOREIGN KEY ("busStopTo_id") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLineRoute" ADD CONSTRAINT "BusLineRoute_busLine_id_fkey" FOREIGN KEY ("busLine_id") REFERENCES "BusLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
