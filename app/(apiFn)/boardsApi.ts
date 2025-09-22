import { apiClient } from "../axios/apiClient";

export const CreateBoardApi = async (payload = {}) => {
  return apiClient.post("/board", payload);
};

export const AddBoardMemberApi = async (payload = {}) => {
  return apiClient.post("/board/member", payload);
};

export const GetBoardsListApip = async (params = {}) => {
  return apiClient.get("/board", params);
};

export const GetUserBoardListApi = async (board_id: string) => {
  return apiClient.get(`/board/${board_id}`);
};
