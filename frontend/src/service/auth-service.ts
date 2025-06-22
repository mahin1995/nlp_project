import { message } from "antd";
import api from "./Api";
export interface IUser {
  email?: string;
  username: string;
  password: string;
}
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
const url = "/api/web/auth";
export const AuthService = {
  register: async ({
    email,
    username,
    password,
  }: IUser): Promise<AuthResponse> => {
    const { data } = await api.post(url + `/register`, {
      email,
      username,
      password,
    });
    if (data && data?.success) {
      return {
        success: true,
        token: data?.token,
        user: data?.user,
      };
    } else {
      return {
        success: false,
        token: "",
        user: { id: "", username: "", email: "" },
      };
    }
  },
  login: async ({ username, password }: IUser): Promise<AuthResponse> => {
    const { data } = await api.post(url + `/login`, {
      username,
      password,
    });
    if (data && data?.success) {
      return {
        success: true,
        token: data?.token,
        user: data?.user,
      };
    } else {
      message.error(
        data?.message || "Login failed. Please check your credentials."
      );
      return {
        success: false,
        token: "",
        user: { id: "", username: "", email: "" },
      };
    }
  },
  storeToken: async ({
    username,
    token,
    jwt_token = null,
  }: {
    username: string;
    token: string;
    jwt_token?: string | null;
  }) => {
    await api
      .post(
        url + `/store-token`,
        {
          username,
          token,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          message.success("Token stored successfully");
        } else {
          message.error("Failed to store token");
        }
      })
      .catch((error) => {
        console.error("Error storing token:", error);
        message.error("Error storing token");
      });
  },
};
