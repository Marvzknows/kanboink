import { apiClient } from "../axios/apiClient";

export const GetMeApi = async () => {
  return apiClient.get("/auth/me");
};
