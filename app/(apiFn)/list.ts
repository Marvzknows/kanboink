import { apiClient } from "../axios/apiClient";

export const CreateBoardListApi = async (payload = {}) => {
  return apiClient.post("/list", payload);
};
