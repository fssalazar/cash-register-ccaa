-- CreateTable
CREATE TABLE "CashRegister" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "CashRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "openDate" TIMESTAMP(3) NOT NULL,
    "closeDate" TIMESTAMP(3),
    "openAmount" DOUBLE PRECISION NOT NULL,
    "cashRegisterId" UUID NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Closure" (
    "id" UUID NOT NULL,
    "initialAmount" DOUBLE PRECISION NOT NULL,
    "rereceivedAmount" DOUBLE PRECISION NOT NULL,
    "totalRecordsAmount" DOUBLE PRECISION NOT NULL,
    "receivedAmountByCard" DOUBLE PRECISION NOT NULL,
    "receivedAmountByCheck" DOUBLE PRECISION NOT NULL,
    "receivedAmountByMoney" DOUBLE PRECISION NOT NULL,
    "sessionId" UUID NOT NULL,

    CONSTRAINT "Closure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bills" (
    "id" UUID NOT NULL,
    "hundred" INTEGER NOT NULL,
    "fifty" INTEGER NOT NULL,
    "twenty" INTEGER NOT NULL,
    "ten" INTEGER NOT NULL,
    "five" INTEGER NOT NULL,
    "two" INTEGER NOT NULL,
    "one" INTEGER NOT NULL,
    "fiftyCent" INTEGER NOT NULL,
    "twentyFiveCent" INTEGER NOT NULL,
    "tenCent" INTEGER NOT NULL,
    "fiveCent" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "sessionId" UUID NOT NULL,

    CONSTRAINT "Bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" UUID NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CashRegister_userId_idx" ON "CashRegister"("userId");

-- CreateIndex
CREATE INDEX "CashRegister_companyId_idx" ON "CashRegister"("companyId");

-- CreateIndex
CREATE INDEX "Session_cashRegisterId_idx" ON "Session"("cashRegisterId");

-- CreateIndex
CREATE UNIQUE INDEX "Closure_sessionId_key" ON "Closure"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Bills_sessionId_key" ON "Bills"("sessionId");

-- CreateIndex
CREATE INDEX "Record_sessionId_idx" ON "Record"("sessionId");

-- AddForeignKey
ALTER TABLE "CashRegister" ADD CONSTRAINT "CashRegister_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashRegister" ADD CONSTRAINT "CashRegister_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "CashRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Closure" ADD CONSTRAINT "Closure_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bills" ADD CONSTRAINT "Bills_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
