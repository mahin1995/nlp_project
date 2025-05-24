import { RESPONSE_STATUS } from "@/utils/utils";
import api from "./Api";
export interface INews extends Document {
  _id: string;
  id: string;
  title: string;
  link: string;
  category: string;
  content: string;
  publishedAt: Date;
  image: string;
  embedding: number[];
  author: string;
  website: string;
  categoryDetails?: { name: string };
}

const url = "api/news";
export const NewsService = {
  getAllNews: async (page = 1, limit = 10) => {
    const { data } = await api.get(url + `/all?page=${page}&limit=${limit}`);
    if (data) {
      return {
        pageData: data?.data,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        status: RESPONSE_STATUS.SUCCESS,
      };
    } else {
      return {
        status: RESPONSE_STATUS.FAILED,
      };
    }
  },
  getAllNewsByCategory: async (page = 1, limit = 10, category = "") => {
    const { data } = await api.get(
      url + `/all-by-category?page=${page}&limit=${limit}&category=${category}`
    );
    if (data) {
      return {
        pageData: data?.data,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        status: RESPONSE_STATUS.SUCCESS,
      };
    } else {
      return {
        status: RESPONSE_STATUS.FAILED,
      };
    }
  },
  getNewsById: async (id = "") => {
    const { data } = await api.get(url + `/get-by-id/${id}`);
    console.log("My Log data: ", data);
    if (data && data?.data) {
      return {
        news: data?.data,
        status: RESPONSE_STATUS.SUCCESS,
      };
    } else {
      return {
        status: RESPONSE_STATUS.FAILED,
      };
    }
  },
  getHomePageData: async () => {
    const { data } = await api.get(url + `/home`);
    console.log("My Log response: ", data);
    if (data) {
      return {
        data: data,
        status: RESPONSE_STATUS.SUCCESS,
      };
    } else {
      return {
        status: RESPONSE_STATUS.FAILED,
      };
    }
  },
};
