"use client";

import { Layout } from "antd";
import Image from "next/image";
import logo from "../../../public/ccaa.png";

export function LayoutCCAA({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="h-screen w-screen">
      <Layout.Header className="bg-blue-900 flex items-center">
        <Image src={logo.src} alt="Logo" width={60} height={60} priority />
      </Layout.Header>
      <Layout.Content className="w-full">{children}</Layout.Content>
    </Layout>
  );
}
