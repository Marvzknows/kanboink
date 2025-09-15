import { apiClient } from "../axios/apiClient";

export const GetUserListApi = (params = {}) => {
  return apiClient.get("/user", params);
};

export const SetUserActiveBoardApi = (payload = {}) => {
  return apiClient.post("/user/active-board", payload);
};
