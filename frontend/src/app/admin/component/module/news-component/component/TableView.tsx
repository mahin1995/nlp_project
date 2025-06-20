import {
  deleteAndUndoNews,
  getAllNews,
  News,
} from "@/app/admin/service/news.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Table, TablePaginationConfig, TableProps, Tabs } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useState } from "react";
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
  const mutation = useMutation({
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
      render: ({ _id }: { _id: string }) => (
        <>
          {tabState == RECORD_STATUS.ACTIVE ? (
            <>
              {" "}
              <Button
                onClick={() => {
                  mutation.mutate({
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
            </>
          ) : (
            <>
              <Button
                type="default"
                onClick={() => {
                  mutation.mutate({
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
