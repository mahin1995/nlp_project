"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  notification,
  Row,
  Select,
} from "antd";

import { DropDowlResponse } from "@/app/admin/lib/interfaces";
import { NEWS_MODULE_PATH } from "@/app/admin/lib/urlPath";
import { dropDown } from "@/app/admin/service/category.service";
import {
  createNews,
  getById,
  News,
  updateNews,
} from "@/app/admin/service/news.service";
import { UploadFile } from "antd/lib/upload/interface";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UploadImage from "../../../common/UploadImage";
import TextEditor from "../../../Editor/TextEditor";

// const { TextArea } = Input;
// const initialValue: Descendant[] = [
//   {
//     type: "paragraph",
//     children: [{ text: "Write something here..." }],
//   },
// ];
const FormView = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {}, [id]);
  const { data: categories, isLoading: loadingCategories } = useQuery<
    DropDowlResponse[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await dropDown();
      return response.data; // assuming ApiResponse has a 'data' property with DropDowlResponse[]
    },
  });
  const { data: singleNews } = useQuery<News, Error>({
    queryKey: ["news", id],
    queryFn: () => {
      if (id) return getById(id);
      return Promise.reject("No ID provided");
    },
    enabled: !!id, // Avoid fetching when id is falsy
  });
  useEffect(() => {
    if (singleNews) {
      form.setFieldsValue(singleNews);
      setValue(singleNews.content);
    }
  }, [singleNews, form]);
  const mutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      form.resetFields();
      notification.success({
        message: "News created successfully",
      });
      router.push("/admin/news/list");
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateNews,
    onSuccess: () => {
      notification.success({
        message: "News updated successfully",
      });
      router.push("/admin/news/list");
    },
  });

  interface FormValues {
    id?: string | null; // Assuming id can be null if not provided
    _id?: string | null; // Assuming _id can be null if not provided
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
    let imageUrl = values.image;
    if (fileList && fileList.length > 0) {
      imageUrl = fileList[0].response?.url || fileList[0].url;
    }
    const payload: News = {
      title: values.title,
      link: values.link,
      content: value,
      website: values.website,
      category: values.category,
      author: values.author,
      image: imageUrl,
      publishedAt: new Date().toISOString(),
    };
    if (id) {
      const _payload: News = {
        ...payload,
        _id: id,
        id: singleNews?._id ?? undefined,
      };
      updateMutation.mutate({ body: _payload });
    } else {
      mutation.mutate(payload);
    }
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
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select
              loading={loadingCategories}
              showSearch
              placeholder="Select category"
            >
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
          {/* <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item> */}
          {/* <RichTextEditor name="content" form={form} /> */}
          <TextEditor
            value={value}
            setValue={(value) => {
              setValue(value);
            }}
          />
        </Col>
        <Col xs={24} md={24}>
          <UploadImage
            fileList={fileList}
            setFileList={(files) => {
              setFileList(files);
              form.validateFields(["file"]);
            }}
            fileSize={10}
            apiEndpoint={NEWS_MODULE_PATH.NEWS_UPLOAD_IMAGE}
          />
        </Col>
        <Col xs={24} md={24}>
          <Image src={form.getFieldValue("image") || ""} alt="" />
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
