"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";

import { dropDown } from "@/app/admin/service/category.service";
import { News } from "@/app/admin/service/news.service";

const { TextArea } = Input;

const FormView = () => {
  const [form] = Form.useForm();

//   const { data: categories, isLoading: loadingCategories } = useQuery({
//     queryKey: ["categories"],
//     queryFn: dropDown,
//   });

//   const mutation = useMutation({
//     mutationFn: createNews,
//     onSuccess: () => {
//       form.resetFields();
//     },
//   });

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
    // const payload: News = {
    //   _id: null,
    //   title: values.title,
    //   link: values.link,
    //   content: values.content,
    // //   image: values.image,
    //   website: values.website,
    //   category: values.category,
    //   author: values.author,
    // };

    // mutation.mutate(payload);
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
              {/* {categories?.map((cat: any) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))} */}
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
