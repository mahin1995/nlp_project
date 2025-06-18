import { ApiResponse } from "../component/dataTable/GenericTable";
import AXIOS_API from "../lib/axios";
import { CATEGORY_MODULE_PATH } from "../lib/urlPath";

export interface ICategoryOut {
  _id: string;
  name: string;
  link: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dropDown = async (): Promise<ApiResponse<ICategoryOut>> => {
  const response = await AXIOS_API.get(CATEGORY_MODULE_PATH.DROP_DOWN);
  return {
    data: response.data.data,
    total: response.data.total,
  };
};

export const getAllCategory = async (
  status: string,
  page: number,
  limit: number = 10
): Promise<ApiResponse<ICategoryOut>> => {
  const response = await AXIOS_API.get(CATEGORY_MODULE_PATH.GET_ALL, {
    params: {
      status,
      page,
      limit,
    },
  });
  return {
    data: response.data.data,
    total: response.data.total,
  };
};
