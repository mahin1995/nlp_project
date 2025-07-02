"use client";
import {
  getAllCategory,
  ICategoryIn,
  ICategoryOut,
  searchCategory,
} from "@/app/admin/service/category.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Table, TablePaginationConfig, TableProps } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useState } from "react";
import { useColumnSearch } from "../../../common/useColumnSearch";
import { ApiResponse } from "../../../dataTable/GenericTable";
import { RECORD_STATUS } from "../../../types";

interface QueryParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
  sorters: SorterResult<ICategoryOut> | SorterResult<ICategoryOut>[];
}

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

  const [searchState, setSearchState] = useState<
    Partial<Record<keyof ICategoryOut, string>>
  >({});

  // Mutation function example
  const mutation = useMutation({
    mutationFn: (filters: Partial<Record<keyof ICategoryIn, string>>) => {
      // Your API call with filters
      //   return apiCallWithFilters(filters);
      console.log("My Log searchState: ", searchState);
      console.log("My Log filters: ", filters);
      return searchCategory(
        RECORD_STATUS.ACTIVE,
        queryParams.pagination.current || 1,
        queryParams.pagination.pageSize || 10,
        {
          name: filters.name ?? "",
          link: filters.link ?? "",
          description: filters.description ?? "",
        }
      );
    },
  });
  const { data: searchData } = mutation;
  const { getColumnSearchProps } = useColumnSearch<ICategoryOut>({
    searchState,
    setSearchState,
    onSearchChange: (filters) => {
      // Trigger mutation when search changes
      mutation.mutate(filters);
    },
  });

  // Columns configuration with search functionality
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      //   sorter: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      //   ...getColumnSearchProps("link"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      //   ...getColumnSearchProps("description"),
    },
  ];

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
  const dataSource = searchData?.data || data?.data || [];
  const totalItems = searchData?.total || data?.total || 0;
  return (
    <Table<ICategoryOut>
      columns={columns}
      dataSource={dataSource || []}
      loading={isLoading}
      onChange={handleTableChange}
      pagination={{
        current: queryParams.pagination.current,
        pageSize: queryParams.pagination.pageSize,
        total: totalItems || 0,
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
