// app/admin/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/auth/signin");
    } else if (session.user.role !== "Admin") {
      router.push("/unauthorized"); // Redirect to an unauthorized page or handle it accordingly
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return <div>Welcome to the Admin Dashboard, {session.user.name}</div>;
};

export default AdminDashboard;
