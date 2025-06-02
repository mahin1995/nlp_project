"use client";
import { BackwardOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import { useRouter } from "next/navigation";

import React from "react";

type FromPage = "view" | "create";

interface PageHeaderBlockProps {
  fromPage: FromPage;
  title: string;
  url: string;
  createPermission: boolean;
  TableView: React.ComponentType<{ fromPage: FromPage; url: string }>;
  AddEditForm: React.ComponentType<{ fromPage: FromPage; url: string }>;
}

const PageHeaderBlock: React.FC<PageHeaderBlockProps> = ({
  fromPage,
  title,
  url,
  createPermission,
  TableView,
  AddEditForm,
}) => {
  const router = useRouter();

  return (
    <section className="p-4 space-y-4 mt-1">
      <div className="bg-white px-4 py-3 rounded-md">
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <Breadcrumb.Item>
              <p>{title}</p>
            </Breadcrumb.Item>
          </Breadcrumb>
          {createPermission && (
            <Button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              icon={
                fromPage === "view" ? <PlusOutlined /> : <BackwardOutlined />
              }
              type="primary"
              size="large"
              shape="round"
              onClick={() => {
                router.push(fromPage === "view" ? `${url}/add` : `${url}/list`);
              }}
            >
              {fromPage === "create" ? "Back" : "Add"}
            </Button>
          )}
        </div>
      </div>

      {fromPage === "view" ? (
        <TableView fromPage={fromPage} url={url} />
      ) : (
        <AddEditForm fromPage={fromPage} url={url} />
      )}
    </section>
  );
};

export default PageHeaderBlock;
