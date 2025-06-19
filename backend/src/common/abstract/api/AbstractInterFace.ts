interface ICrudService<T> {
  Create(input: T): Promise<{ data: T }>;
  GetAll(query: any): Promise<{ data: T }>;
}
