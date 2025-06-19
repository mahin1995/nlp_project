import { useQuery } from "@tanstack/react-query";
import { Table, TablePaginationConfig, TableProps } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useMemo, useState } from "react";
// Generic TypeScript interfaces

export enum STATUS_RESPONSE {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
export interface ApiResponse<T> {
  data: T[];
  total: number;
  [key: string]: unknown; // Allow additional properties
}
export interface ApiCreateResponse {
  message?: unknown;
  status?: STATUS_RESPONSE;
  code?: number;
}

export interface QueryParams<T = unknown> {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
  sorters: SorterResult<T> | SorterResult<T>[];
}

export interface GenericTableProps<T> {
  columns: TableProps<T>["columns"];
  fetchData: (
    page: number,
    pageSize: number,
    sortField?: string,
    sortOrder?: string,
    filters?: Record<string, unknown>
  ) => Promise<ApiResponse<T>>;
  rowKey: keyof T | ((record: T) => string);
  initialPageSize?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  scroll?: TableProps<T>["scroll"];
}

const GenericTable = <T extends object>({
  columns,
  fetchData,
  rowKey,
  initialPageSize = 10,
  showSizeChanger = true,
  pageSizeOptions = ["10", "20", "50", "100"],
  scroll = { x: true },
}: GenericTableProps<T>) => {
  const [queryParams, setQueryParams] = useState<QueryParams<T>>({
    pagination: {
      current: 1,
      pageSize: initialPageSize,
    },
    filters: {},
    sorters: {},
  });

  // Extract sort parameters
  const sortField = useMemo(() => {
    if (Array.isArray(queryParams.sorters)) {
      return queryParams.sorters[0]?.field as string | undefined;
    }
    return queryParams.sorters.field as string | undefined;
  }, [queryParams.sorters]);

  const sortOrder = useMemo(() => {
    if (Array.isArray(queryParams.sorters)) {
      return queryParams.sorters[0]?.order as string | undefined;
    }
    return queryParams.sorters.order as string | undefined;
  }, [queryParams.sorters]);

  // React Query data fetching
  const { data, isLoading, isError, error } = useQuery<
    ApiResponse<T>,
    Error,
    ApiResponse<T>
  >({
    queryKey: [
      "tableData",
      queryParams.pagination.current,
      queryParams.pagination.pageSize,
      sortField,
      sortOrder,
      queryParams.filters,
    ],
    queryFn: () =>
      fetchData(
        queryParams.pagination.current || 1,
        queryParams.pagination.pageSize || initialPageSize,
        sortField,
        sortOrder?.replace("end", ""),
        queryParams.filters
      ),
  });

  // Handle table changes
  const handleTableChange: TableProps<T>["onChange"] = (
    pagination,
    filters,
    sorters
  ) => {
    setQueryParams({
      pagination: {
        ...queryParams.pagination,
        current: pagination.current || 1,
        pageSize: pagination.pageSize || initialPageSize,
      },
      filters,
      sorters,
    });
  };

  return (
    <div>
      {isError && (
        <div style={{ marginBottom: 16, color: "red" }}>
          Error: {error?.message}
        </div>
      )}

      <Table<T>
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          ...queryParams.pagination,
          total: data?.total || 0,
          showSizeChanger,
          pageSizeOptions,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowKey={rowKey}
        scroll={scroll}
        showSorterTooltip={false}
      />
    </div>
  );
};
export default GenericTable;
