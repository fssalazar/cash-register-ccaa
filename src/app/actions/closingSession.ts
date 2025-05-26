"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismaClient";

interface CloseSessionData {
  sessionId: string;
  closure: {
    initialAmount: number;
    rereceivedAmount: number;
    totalRecordsAmount: number;
    receivedAmountByCard: number;
    receivedAmountByCheck: number;
    receivedAmountByMoney: number;
  };
  bills: {
    twoHundred: number;
    hundred: number;
    fifty: number;
    twenty: number;
    ten: number;
    five: number;
    two: number;
    one: number;
    fiftyCent: number;
    twentyFiveCent: number;
    tenCent: number;
    fiveCent: number;
    total: number;
  };
}

export async function closeSession(data: CloseSessionData) {
  const { sessionId, closure, bills } = data;

  // Ensure the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  // Check if the session exists
  const existingSession = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!existingSession) {
    throw new Error("Sessão não encontrada.");
  }

  // Create closure entry
  const createdClosure = await prisma.closure.create({
    data: {
      initialAmount: closure.initialAmount,
      rereceivedAmount: closure.rereceivedAmount,
      totalRecordsAmount: closure.totalRecordsAmount,
      receivedAmountByCard: closure.receivedAmountByCard,
      receivedAmountByCheck: closure.receivedAmountByCheck,
      receivedAmountByMoney: closure.receivedAmountByMoney,
      session: { connect: { id: sessionId } },
    },
  });

  // Create bills entry
  const createdBills = await prisma.bills.create({
    data: {
      twoHundred: bills.twoHundred,
      hundred: bills.hundred,
      fifty: bills.fifty,
      twenty: bills.twenty,
      ten: bills.ten,
      five: bills.five,
      two: bills.two,
      one: bills.one,
      fiftyCent: bills.fiftyCent,
      twentyFiveCent: bills.twentyFiveCent,
      tenCent: bills.tenCent,
      fiveCent: bills.fiveCent,
      total: bills.total,
      session: { connect: { id: sessionId } },
    },
  });

  // Update the session with the close date
  const updatedSession = await prisma.session.update({
    where: { id: sessionId },
    data: { closeDate: new Date() },
  });

  // Return the updated session details
  return { updatedSession, createdClosure, createdBills };
}
