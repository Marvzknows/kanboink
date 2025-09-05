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

// ===============

// export const apiClient = {
//   get: async <T = any>(url: string, params?: any): Promise<T> => {
//     const response = await axiosInstance.get<T>(url, { params });
//     return response.data;
//   },

//   post: async <T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> => {
//     const response = await axiosInstance.post<T>(url, payload, config);
//     return response.data;
//   },

//   put: async <T = any>(url: string, payload: any): Promise<T> => {
//     const response = await axiosInstance.put<T>(url, payload);
//     return response.data;
//   },

//   patch: async <T = any>(url: string, payload: any): Promise<T> => {
//     const response = await axiosInstance.patch<T>(url, payload);
//     return response.data;
//   },

//   delete: async <T = any>(url: string): Promise<T> => {
//     const response = await axiosInstance.delete<T>(url);
//     return response.data;
//   },
// };

// Example usage with types:
// const user = await apiClient.get<User>('/user/me');
// const users = await apiClient.get<User[]>('/users');
