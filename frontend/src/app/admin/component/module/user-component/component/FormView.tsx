"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row } from "antd";

import {
  createUser,
  getById,
  IAdminUser,
} from "@/app/admin/service/user.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// const { TextArea } = Input;
// const initialValue: Descendant[] = [
//   {
//     type: "paragraph",
//     children: [{ text: "Write something here..." }],
//   },
// ];
const FormView = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: singleUser } = useQuery<IAdminUser, Error>({
    queryKey: ["user", id],
    queryFn: () => {
      if (id) return getById(id);
      return Promise.reject("No ID provided");
    },
    enabled: !!id, // Avoid fetching when id is falsy
  });
  useEffect(() => {
    if (singleUser) {
      form.setFieldsValue(singleUser);
    }
  }, [singleUser, form]);
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      form.resetFields();
      router.push("/admin/user/list");
    },
  });
  //   const updateMutation = useMutation({
  //     mutationFn: updateNews,
  //     onSuccess: () => {
  //       notification.success({
  //         message: "News updated successfully",
  //       });
  //       router.push("/admin/news/list");
  //     },
  //   });

  interface FormValues {
    username: string;
    email: string;
    password?: string;
  }

  const onFinish = (values: FormValues) => {
    const payload: IAdminUser = {
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password?.trim(),
    };
    // if (id) {
    //   const _payload: News = {
    //     ...payload,
    //     _id: id,
    //     id: singleUser?._id ?? undefined,
    //   };
    //   updateMutation.mutate({ body: _payload });
    // } else {
    mutation.mutate({ body: payload });
    // }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              //   loading={mutation.isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormView;
