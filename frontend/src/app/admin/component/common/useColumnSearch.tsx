import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import { Button, Input, Space } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRef } from "react";

interface UseColumnSearchProps<T extends object> {
  // External state management
  searchState: Partial<Record<keyof T, string>>;
  setSearchState: (state: Partial<Record<keyof T, string>>) => void;
  // Optional mutation callback when search changes
  onSearchChange?: (filter: Partial<Record<keyof T, string>>) => void;
}

export const useColumnSearch = <T extends object>({
  searchState,
  setSearchState,
  onSearchChange,
}: UseColumnSearchProps<T>) => {
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: keyof T
  ) => {
    confirm();
    const newState = { ...searchState, [dataIndex]: selectedKeys[0] };
    setSearchState(newState);
    onSearchChange?.(newState);
  };

  const handleReset = (dataIndex: keyof T, clearFilters: () => void) => {
    clearFilters();
    const rest = { ...searchState };
    delete rest[dataIndex];
    setSearchState(rest);
    onSearchChange?.(rest);
  };

  const getColumnSearchProps = (dataIndex: keyof T): TableColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(dataIndex, clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchState({
                ...searchState,
                [dataIndex]: (selectedKeys as string[])[0],
              });
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return typeof recordValue === "string" || typeof recordValue === "number"
        ? recordValue
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : false;
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text: unknown) => {
      const searchValue = searchState[dataIndex];
      if (searchValue && text) {
        const textStr = String(text);
        return textStr.toLowerCase().includes(searchValue.toLowerCase()) ? (
          <span style={{ color: "#1677ff" }}>{textStr}</span>
        ) : (
          textStr
        );
      }
      return text !== null && text !== undefined ? String(text) : "";
    },
  });

  return { getColumnSearchProps };
};
