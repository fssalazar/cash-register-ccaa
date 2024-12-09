// app/cash-registers/[cashRegisterId]/sessions/[sessionId]/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismaClient";
import { CashRegisterService } from "@/services/cash-register";
import { SessionService } from "@/services/sessions";
import { Session } from "@/app/components/features/Session/session";
import { authOptions } from "@/lib/authOptions";

interface PageProps {
  params: Promise<{
    cashRegisterId: string;
    sessionId: string;
  }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { cashRegisterId, sessionId } = await params;

  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  // Fetch the cash register and verify it belongs to the user
  const cashRegisterService = new CashRegisterService(prisma, userId);
  const cashRegister = await cashRegisterService.getCashRegisterById(
    cashRegisterId
  );

  if (!cashRegister) {
    return (
      <div>
        <p>Cash register not found or you do not have access to it.</p>
      </div>
    );
  }

  // Fetch the session and verify it belongs to the cash register
  const sessionService = new SessionService(prisma, cashRegisterId);
  const sessionData = await sessionService.getSession(sessionId);

  if (!sessionData) {
    return (
      <div>
        <p>Session not found or it does not belong to this cash register.</p>
      </div>
    );
  }

  return <Session session={sessionData} />;
}
