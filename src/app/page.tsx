// app/page.tsx
"use client";

import { Button } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Cash Register App</h1>
      {session ? (
        <div>
          <p>Hello, {session.user.name}</p>
          <Button type="primary" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      ) : (
        <Button type="primary" onClick={() => router.push("/auth/signin")}>
          Sign In
        </Button>
      )}
    </div>
  );
}
