"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/signin/page.tsx

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (res?.error) {
      message.error("Invalid email or password");
    } else {
      message.success("Successfully signed in");
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Form
        name="signin"
        className="w-full max-w-md p-8 bg-white rounded shadow-md"
        onFinish={onFinish}
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
