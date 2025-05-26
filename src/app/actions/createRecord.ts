// app/actions/createRecord.ts

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismaClient";
import { SessionService } from "@/services/sessions";
import { revalidatePath } from "next/cache";

interface CreateRecordData {
  code: string;
  action: string;
  value: number;
  sessionId: string;
}

export async function createRecord(data: CreateRecordData) {
  const { code, action, value, sessionId } = data;

  // Ensure the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  // Optionally, validate the action value
  const validActions = [
    "PP",
    "PB",
    "PD",
    "RB",
    "RD",
    "RP",
    "RL",
    "EXE",
    "EXS",
    "EXR",
  ];
  if (!validActions.includes(action)) {
    throw new Error("Ação inválida.");
  }

  // Create a session service instance
  const sessionService = new SessionService(prisma, "");

  // Create the record
  const record = await sessionService.createRecordInSession({
    code,
    action,
    value,
    sessionId,
  });

  // Revalidate the path to refresh data
  revalidatePath(`/cash-registers/[cashRegisterId]/sessions/[sessionId]`);

  return record;
}
