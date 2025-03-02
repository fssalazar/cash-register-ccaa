// app/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { LayoutCCAA } from "@/app/components/Layout";
import { prisma } from "@/lib/prismaClient";
import { SessionService } from "@/services/sessions";
interface PageProps {
  searchParams?: Record<string, string | string[]>;
}

const AdminDashboard = async ({ searchParams }: PageProps) => {
  const page = parseInt((searchParams?.page as string) ?? "1", 10);
  const size = parseInt((searchParams?.size as string) ?? "10", 10);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const sessionService = new SessionService(
    prisma,
    undefined,
    session.user.companyId
  );
  const sessions = await sessionService.getSessionsByCompanyId(page, size);

  return (
    <LayoutCCAA>
      <div>Welcome to the Admin Dashboard, {session.user.name}</div>
    </LayoutCCAA>
  );
};

export default AdminDashboard;
