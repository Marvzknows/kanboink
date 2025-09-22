import { apiClient } from "../axios/apiClient";

export const CreateBoardListApi = async (payload = {}) => {
  return apiClient.post("/list", payload);
};

export const UpdateListPositionApi = async (payload = {}) => {
  return apiClient.put("/list/position", payload);
};
