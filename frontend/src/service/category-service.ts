import { RESPONSE_STATUS } from "@/utils/utils";
import api from "./Api";

const url = "api/category";
export const CategoryService = {
  getAll: async () => {

    const response = await api.get(url);
    if (response.data) {
      return {
        data: response.data,
        status: RESPONSE_STATUS.SUCCESS,
      };
    } else {
      return {
        status: RESPONSE_STATUS.FAILED,
      };
    }
  },
  
};
