"use client";
import {
  deleteAndUndoNews,
  getAllNews,
  News,
  sendNotification,
} from "@/app/admin/service/news.service";
import { truncateText } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  notification,
  Table,
  TablePaginationConfig,
  TableProps,
  Tabs,
} from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ApiResponse } from "../../../dataTable/GenericTable";
import { RECORD_STATUS } from "../../../types";
// Define TypeScript interfaces

interface QueryParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
  sorters: SorterResult<News> | SorterResult<News>[];
}

// Mock API function (replace with your actual API call)
const fetchData = async (
  page: number,
  size: number,
  dataState: RECORD_STATUS
): Promise<ApiResponse<News>> => {
  return await getAllNews(dataState, page, size);
};

const TableView = () => {
  const router = useRouter();
  const [tabState, setTabState] = useState(RECORD_STATUS.ACTIVE);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
    sorters: {},
  });

  // UseQuery hook for data fetching
  const { data, isLoading } = useQuery<ApiResponse<News>, Error>({
    queryKey: [
      "news",
      queryParams.pagination.current,
      queryParams.pagination.pageSize,
      queryParams.sorters,
      tabState,
    ],
    queryFn: () => {
      return fetchData(
        queryParams.pagination.current || 1,
        queryParams.pagination.pageSize || 10,
        tabState
      );
    },
  });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteAndUndoNews,
    onSuccess: () => {
      console.log("My Log :success");
      // ✅ Refetch the query after successful mutation
      queryClient.invalidateQueries({
        queryKey: [
          "news",
          queryParams.pagination.current,
          queryParams.pagination.pageSize,
          queryParams.sorters,
          tabState,
        ],
      });
    },
  });
  const sendNotificationMutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      console.log("Notification sent successfully");
      notification.success({
        message: "Notification sent successfully",
        description: "The notification has been sent to the user.",
      });
      // Optionally, you can show a success message or perform other actions
    },
  });
  // Handle table changes (pagination, sorting, filtering)
  const handleTableChange: TableProps<News>["onChange"] = (
    pagination,
    filters,
    sorters
  ) => {
    setQueryParams({
      pagination: {
        ...queryParams.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters,
      sorters: sorters as SorterResult<News> | SorterResult<News>[],
    });
  };

  // Columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      sorter: true,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "website",
      dataIndex: "website",
      key: "website",
      //   filters: [
      //     { text: "Admin", value: "Admin" },
      //     { text: "User", value: "User" },
      //   ],
    },
    {
      title: tabState == RECORD_STATUS.ACTIVE ? "Delete" : "Re-active",
      render: ({ _id, title }: { _id: string; title: string }) => (
        <>
          {tabState == RECORD_STATUS.ACTIVE ? (
            <>
              {" "}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    router.push(`/admin/news/add/?id=${_id}`);
                  }}
                  type="default"
                  icon={<FaEdit />}
                />
                <Button
                  onClick={() => {
                    sendNotificationMutation.mutate({
                      title: truncateText(title, 50),
                      body: `News with title ${truncateText(
                        title,
                        50
                      )} Read More .`,
                    });
                  }}
                  type="default"
                  danger
                  icon={
                    <svg
                      fill="#000000"
                      height="200px"
                      width="200px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 488.5 488.5"
                      xmlSpace="preserve"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="-mb-1 size-5"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M405.1,210.95v0.4c0,7.5,6.1,13.7,13.7,13.7h56c7.5,0,13.7-6.1,13.7-13.7v-0.4c0-7.5-6.1-13.7-13.7-13.7h-56 C411.2,197.25,405.1,203.35,405.1,210.95z"></path>{" "}
                            <path d="M406.2,270.75l53,21.1c7.4,2.9,15.6-1,18.1-8.5c2.2-6.8-1.3-14.2-8-16.9l-53-21.1c-7.4-2.9-15.6,1-18.1,8.5 C396.1,260.75,399.5,268.15,406.2,270.75z"></path>{" "}
                            <path d="M151.8,132.15H56.3c-19,0-34.4,15.4-34.4,34.4v15.3H11.5c-6.4,0-11.5,5.2-11.5,11.5v43.1c0,6.4,5.2,11.5,11.5,11.5h10.4 v13.2c0,19,15.4,34.4,34.4,34.4h8.6l39.3,130.8l5.9-1.4l19.9-4.7l5.9-1.4l-15.6-123.3h31.5v-14.3c41.8,6.8,110.8,24.5,159,70.2 c0.5,8.5,8,15.1,16.9,14.1c7.7-0.9,13.3-8,13.3-15.8v-88.5c19.4-7.2,33.2-25.9,33.2-47.7c0-21.9-13.8-40.5-33.2-47.7v-87.8 c0-7.8-5.5-14.9-13.3-15.8c-8.9-1-16.3,5.6-16.9,14.1c-48.2,45.7-117.2,63.4-159,70.2L151.8,132.15L151.8,132.15z"></path>{" "}
                            <path d="M459.3,130.45l-53,21.1c-6.7,2.7-10.2,10-8,16.9c2.4,7.5,10.7,11.5,18.1,8.5l53-21.1c6.7-2.7,10.2-10,8-16.9 C474.9,131.45,466.6,127.55,459.3,130.45z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  }
                />

                <Button
                  onClick={() => {
                    deleteMutation.mutate({
                      id: _id,
                      recordStatus: RECORD_STATUS.ACTIVE,
                    });
                  }}
                  type="default"
                  danger
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="-mb-1 size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      />
                    </svg>
                  }
                />
              </div>
            </>
          ) : (
            <>
              <Button
                type="default"
                onClick={() => {
                  deleteMutation.mutate({
                    id: _id,
                    recordStatus: RECORD_STATUS.INACTIVE,
                  });
                }}
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17.5L5.5 14L9 10.5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.5 14C19.5 10.1964 16.3036 7 12.5 7H5.5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.5 10L18 13.5L14.5 17"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
              />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <Tabs
      onChange={(value) => {
        if (value == RECORD_STATUS.ACTIVE) setTabState(RECORD_STATUS.ACTIVE);
        else setTabState(RECORD_STATUS.INACTIVE);
      }}
      items={[
        {
          label: `ACTIVE`,
          key: RECORD_STATUS.ACTIVE,
          children: (
            <>
              <Table<News>
                columns={columns}
                dataSource={data?.data || []}
                loading={isLoading}
                onChange={handleTableChange}
                pagination={{
                  ...queryParams.pagination,
                  total: data?.total || 0,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
                }}
                rowKey="_id"
                scroll={{ x: true }}
                showSorterTooltip={false}
              />
            </>
          ),
        },
        {
          label: `INACTIVE`,
          key: RECORD_STATUS.INACTIVE,

          children: (
            <>
              <Table<News>
                columns={columns}
                dataSource={data?.data || []}
                loading={isLoading}
                onChange={handleTableChange}
                pagination={{
                  ...queryParams.pagination,
                  total: data?.total || 0,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
                }}
                rowKey="_id"
                scroll={{ x: true }}
                showSorterTooltip={false}
              />
            </>
          ),
        },
      ]}
    />
  );
};

export default TableView;
