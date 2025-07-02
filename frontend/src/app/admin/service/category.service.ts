import {
  ApiCreateResponse,
  ApiResponse,
  STATUS_RESPONSE,
} from "../component/dataTable/GenericTable";
import AXIOS_API from "../lib/axios";
import { DropDowlResponse } from "../lib/interfaces";
import { CATEGORY_MODULE_PATH } from "../lib/urlPath";

export interface ICategoryOut {
  _id: string;
  name: string;
  link: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICategoryIn {
  _id?: string;
  name: string;
  link: string;
  description?: string;
}

export const dropDown = async (): Promise<ApiResponse<DropDowlResponse>> => {
  const response = await AXIOS_API.get(CATEGORY_MODULE_PATH.DROP_DOWN);
  return {
    data: response.data,
    total: 0,
  };
};
export const createCategory = async ({
  body,
}: {
  body: ICategoryIn;
}): Promise<ApiCreateResponse> => {
  const response = await AXIOS_API.post(CATEGORY_MODULE_PATH.GET_ALL, {
    body,
  });
  return {
    status: STATUS_RESPONSE.FAILED,
    message: response.data,
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
    total: response.data.totalItems,
  };
};
