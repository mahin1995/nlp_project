export interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface Response<T> {
  data: T | null;
  message?: string;
}
