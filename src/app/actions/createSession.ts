// app/actions/createSession.ts

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CashRegisterService } from "@/services/cash-register";
import { prisma } from "@/lib/prismaClient";
import { SessionService } from "@/services/sessions";

interface CreateSessionData {
  openAmount: number;
  openDate: Date;
}

export async function createSession(data: CreateSessionData) {
  const { openAmount, openDate } = data;

  // Ensure the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  const userId = session.user.id;

  // Fetch the cash register for the authenticated user
  const cashRegisterService = new CashRegisterService(prisma, userId);
  const cashRegister = await cashRegisterService.getCashRegisterByUserId();

  if (!cashRegister) {
    throw new Error("Nenhum caixa associado ao usuário encontrado.");
  }

  const cashRegisterId = cashRegister.id;

  // Create a session using the SessionService
  const sessionService = new SessionService(prisma, cashRegisterId);

  const createdSession = await sessionService.createSession(
    openDate,
    openAmount
  );

  // Optionally revalidate the path or resource to ensure fresh data is available
  return createdSession;
}
