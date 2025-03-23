"use client";

import { Layout, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import logo from "../../../public/ccaa.png";

export function LayoutCCAA({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    signOut();
  };

  return (
    <Layout className="h-screen flex flex-col">
      <Layout.Header className="bg-blue-900 flex items-center justify-between">
        <Link href="/">
          <Image src={logo.src} alt="Logo" width={60} height={60} priority />
        </Link>
        <Button type="primary" onClick={handleLogout}>
          Sair
        </Button>
      </Layout.Header>
      <Layout.Content className="flex-1 overflow-auto">
        {children}
      </Layout.Content>
    </Layout>
  );
}
