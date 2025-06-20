import {
  getAllCategory,
  ICategoryOut,
} from "@/app/admin/service/category.service";
import { useQuery } from "@tanstack/react-query";
import { Table, TablePaginationConfig, TableProps } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useState } from "react";
import { ApiResponse } from "../../../dataTable/GenericTable";
import { RECORD_STATUS } from "../../../types";

// Define TypeScript interfaces

interface QueryParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
  sorters: SorterResult<ICategoryOut> | SorterResult<ICategoryOut>[];
}

// Mock API function (replace with your actual API call)
const fetchData = async (
  page: number,
  size: number
): Promise<ApiResponse<ICategoryOut>> => {
  return await getAllCategory(RECORD_STATUS.ACTIVE, page, size);
};

const TableView = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
    sorters: {},
  });

  // UseQuery hook for data fetching
  const { data, isLoading } = useQuery<ApiResponse<ICategoryOut>, Error>({
    queryKey: [
      "ICategoryOut",
      queryParams.pagination.current,
      queryParams.pagination.pageSize,
      queryParams.sorters,
    ],
    queryFn: () => {
      return fetchData(
        queryParams.pagination.current || 1,
        queryParams.pagination.pageSize || 10
      );
    },
  });

  // Handle table changes (pagination, sorting, filtering)
  const handleTableChange: TableProps<ICategoryOut>["onChange"] = (
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
      sorters: sorters as
        | SorterResult<ICategoryOut>
        | SorterResult<ICategoryOut>[],
    });
  };

  // Columns configuration
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    // {
    //   title: "Delete",
    //   render: () => (
    //     <Button
    //       type="default"
    //       danger
    //       icon={
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           strokeWidth={1.5}
    //           stroke="currentColor"
    //           className="-mb-1 size-5"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    //           />
    //         </svg>
    //       }
    //     />
    //   ),
    // },
  ];

  return (
    <Table<ICategoryOut>
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
  );
};

export default TableView;
