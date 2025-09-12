import { apiClient } from "../axios/apiClient";

export const GetUserListApi = (params = {}) => {
  return apiClient.get("/user", params);
};
