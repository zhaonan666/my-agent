import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data;
    return data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default request;
