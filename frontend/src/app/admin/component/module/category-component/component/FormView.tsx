"use client";

import { createCategory } from "@/app/admin/service/category.service";
import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row } from "antd";
import { useRouter } from "next/navigation";

interface FormValues {
  _id?: string | null;
  name: string;
  link: string;
  description?: string;
}

const FormView = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      form.resetFields();
      router.push("/admin/category/list");
    },
  });
  const onFinish = (values: FormValues) => {
    // Handle form submission logic here
    console.log("Form values:", values);
    mutation.mutate({
      body: {
        name: values.name,
        link: values.link,
        description: values.description,
      },
    });
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item name="name" label="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="link" label="Link" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
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
    </>
  );
};

export default FormView;
