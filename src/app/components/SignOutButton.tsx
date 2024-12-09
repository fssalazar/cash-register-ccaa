// components/SignOutButton.tsx
"use client";

import { Button } from "antd";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button type="primary" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}
