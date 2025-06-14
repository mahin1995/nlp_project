import { ApiResponse } from "../component/dataTable/GenericTable";
import AXIOS_API from "../lib/axios";
import { NEWS_MODULE_PATH } from "../lib/urlPath";

export interface News {
  _id: string | null;
  id?: string;
  title: string;
  link: string;
  content: string;
  publishedAt: Date | null;
  image: string;
  embedding?: number[];
  author?: string;
  website: string;
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
  console.log("My Log response: ", response);
  return {
    data: response.data.data,
    total: response.data.total,
  };
};
