import {
  ApiCreateResponse,
  ApiResponse,
  STATUS_RESPONSE,
} from "../component/dataTable/GenericTable";
import { RECORD_STATUS } from "../component/types";
import AXIOS_API from "../lib/axios";
import { NEWS_MODULE_PATH } from "../lib/urlPath";

export interface News {
  _id?: string | null;
  id?: string;
  title: string;
  link: string;
  content: string;
  image?: string;
  author?: string;
  website: string;
  category: string;
  publishedAt?: string;
}

export const getAllNews = async (
  status: string,
  page: number,
  limit: number = 10
): Promise<ApiResponse<News>> => {
  const response = await AXIOS_API.get(NEWS_MODULE_PATH.NEWS_GET_ALL, {
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
export const getAllNewsBySearch = async ({
  status,
  page,
  limit = 10,
  body,
}: {
  status: string;
  page: number;
  limit: number;
  body?: Partial<News>;
}): Promise<ApiResponse<News>> => {
  const response = await AXIOS_API.post(
    NEWS_MODULE_PATH.NEWS_GET_ALL_BY_SEARCH,
    body,
    {
      params: {
        status,
        page,
        limit,
      },
    }
  );

  return {
    data: response.data.data,
    total: response.data.total,
  };
};
export const getById = async (id: string): Promise<News> => {
  const response = await AXIOS_API.get(
    NEWS_MODULE_PATH.NEWS_GET_BY_ID + "/" + id
  );

  return response.data;
};
export const deleteAndUndoNews = async ({
  id,
  recordStatus,
}: {
  id: string;
  recordStatus: RECORD_STATUS;
}): Promise<ApiCreateResponse> => {
  let response;
  if (recordStatus == RECORD_STATUS.ACTIVE) {
    response = await AXIOS_API.delete(NEWS_MODULE_PATH.NEWS_DELETE + "/" + id);
  } else {
    response = await AXIOS_API.patch(
      NEWS_MODULE_PATH.NEWS_REACTIVATE + "/" + id
    );
  }

  console.log("My Log response: ", response);
  if (response.status == 200) {
    return {
      status: STATUS_RESPONSE.SUCCESS,
      message: response.data,
    };
  }
  return {
    status: STATUS_RESPONSE.FAILED,
    message: response.data,
  };
};
export const sendNotification = async ({
  title,
  body,
}: {
  title: string;
  body: string;
}): Promise<ApiCreateResponse> => {
  const response = await AXIOS_API.post(
    NEWS_MODULE_PATH.NEWS_SEND_NOTIFICATION,
    { title, body }
  );

  if (response.status == 200) {
    return {
      status: STATUS_RESPONSE.SUCCESS,
      message: response.data,
    };
  }
  return {
    status: STATUS_RESPONSE.FAILED,
    message: response.data,
  };
};
export const createNews = async (body: News): Promise<ApiCreateResponse> => {
  const response = await AXIOS_API.post(NEWS_MODULE_PATH.NEWS_GET_ALL, {
    body,
  });
  return {
    status: STATUS_RESPONSE.FAILED,
    message: response.data,
  };
};
export const updateNews = async ({
  body,
}: {
  body: News;
}): Promise<ApiCreateResponse> => {
  const response = await AXIOS_API.put(NEWS_MODULE_PATH.NEWS_GET_ALL, {
    ...body,
  });
  return {
    status: STATUS_RESPONSE.FAILED,
    message: response.data,
  };
};
