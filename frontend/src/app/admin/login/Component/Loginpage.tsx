"use client";
import type { FormProps } from "antd";
import { Button, Card, Checkbox, Form, Input, notification } from "antd";

import { useRouter } from "next/navigation";
import React from "react";
import AXIOS_API from "../../lib/axios";
import { AUTH_PATH } from "../../lib/urlPath";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const response = await AXIOS_API.post(AUTH_PATH.LOGIN, {
      username: values.username,
      password: values.password,
    });
    if (response.status === 200) {
      console.log("Login successful:", response.data);
      // Handle successful login, e.g., store token, redirect, etc.
      localStorage.setItem("jwt_token", response.data.token); // Adjust based on your API response
      localStorage.setItem("user", response.data.user.username); // Adjust based on your API response
      router.push("/admin");
    } else {
      notification.open({
        message: `error`,
        description: response.data.message || "Login failed",
        placement: "topRight",
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10  bg-gray-400">
        <Card
          title="Login Form"
          variant="borderless"
          style={{ width: 400 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              label={null}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
