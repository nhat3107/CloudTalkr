import axios from "axios";

const BASE_URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : import.meta.env.BACKEND_URL + "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
