import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./axios";

export const apiClient = {
  get: async (url: string, params?: any) => {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  post: async (url: string, payload: any, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post(url, payload, config);
    return response.data;
  },

  put: async (url: string, payload: any) => {
    const response = await axiosInstance.put(url, payload);
    return response.data;
  },

  //   patch: async <T>(url: string, payload: any): Promise<T> => {
  //     const response = await axiosInstance.patch<T>(url, payload);
  //     return response.data;
  //   },

  delete: async (url: string) => {
    const response = await axiosInstance.delete(url);
    return response.data;
  },
};
