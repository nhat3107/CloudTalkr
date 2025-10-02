import axios from "axios";

const BASE_URL = import.meta.env.NODE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL + "/api" : "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
