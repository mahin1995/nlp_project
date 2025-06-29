import {
  ApiCreateResponse,
  ApiResponse,
  STATUS_RESPONSE,
} from "../component/dataTable/GenericTable";
import AXIOS_API from "../lib/axios";
import { USER_MODULE_PATH } from "../lib/urlPath";

export interface IAdminUser {
  username: string;
  email: string;
  password?: string;
}

export const getAllUser = async (
  status: string,
  page: number,
  limit: number = 10
): Promise<ApiResponse<IAdminUser>> => {
  const response = await AXIOS_API.get(USER_MODULE_PATH.USER_GET_ALL, {
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

export const createUser = async ({
  body,
}: {
  body: IAdminUser;
}): Promise<ApiCreateResponse> => {
  const response = await AXIOS_API.post(USER_MODULE_PATH.USER_GET_ALL, {
    body,
  });
  return {
    status: STATUS_RESPONSE.FAILED,
    message: response.data,
  };
};
export const getById = async (id: string): Promise<IAdminUser> => {
  const response = await AXIOS_API.get(
    USER_MODULE_PATH.USER_GET_BY_ID + "/" + id
  );

  return response.data;
};
