import { apiClient } from "../axios/apiClient";

export const CreateBoardApi = async (payload = {}) => {
  return apiClient.post("/board", payload);
};
