// lib/axios.ts
import axios from "axios";

// Create the Axios instance
const AXIOS_API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // e.g., "https://api.example.com"
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject JWT token from localStorage
AXIOS_API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token"); // adjust key if needed
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AXIOS_API;
