"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";

import { DropDowlResponse } from "@/app/admin/lib/interfaces";
import { dropDown } from "@/app/admin/service/category.service";
import { createNews, News } from "@/app/admin/service/news.service";

const { TextArea } = Input;

const FormView = () => {
  const [form] = Form.useForm();

  const { data: categories, isLoading: loadingCategories } = useQuery<
    DropDowlResponse[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await dropDown();
      return response.data; // assuming ApiResponse has a 'data' property with DropDowlResponse[]
    },
  });

  const mutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      form.resetFields();
    },
  });

  interface FormValues {
    title: string;
    link: string;
    image?: string;
    website: string;
    author?: string;
    // You can further specify this if you know the type (e.g., Moment)
    category: string;
    content: string;
  }

  const onFinish = (values: FormValues) => {
    const payload: News = {
      title: values.title,
      link: values.link,
      content: values.content,
      website: values.website,
      category: values.category,
      author: values.author,
      publishedAt: null,
      image: values?.image,
    };

    mutation.mutate(payload);
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="link" label="Link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="author" label="Author">
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="publishedAt" label="Published At">
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select loading={loadingCategories} placeholder="Select category">
              {categories &&
                categories?.map((cat: DropDowlResponse) => (
                  <Select.Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={24}>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
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
