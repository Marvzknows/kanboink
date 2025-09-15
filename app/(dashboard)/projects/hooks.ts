import { AddBoardMemberApi, CreateBoardApi } from "@/app/(apiFn)/boardsApi";
import { GetUserListApi } from "@/app/(apiFn)/userApi";
import { PaginatedResponseT, UserT } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type PaginationApiParamsT = {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

type AddBaordMemberPayloadT = {
  user_id: string;
  board_id: string;
};

export const useBoards = () => {
  // POST: Crete new Board
  const createBoardMutation = useMutation({
    mutationFn: async (title: string) => {
      return await CreateBoardApi({ title });
    },
  });

  // GET: list of user's
  const useUserList = ({
    search,
    page,
    limit,
    enabled = true,
  }: PaginationApiParamsT) => {
    return useQuery<PaginatedResponseT<UserT>>({
      queryKey: ["userList", search, page, limit],
      queryFn: async () => {
        return await GetUserListApi({ search, page, limit });
      },
      enabled,
    });
  };

  // POST: Add board member
  const addBaordMemberMutation = useMutation({
    mutationFn: async (payload: AddBaordMemberPayloadT) => {
      return await AddBoardMemberApi(payload);
    },
  });

  return { createBoardMutation, useUserList, addBaordMemberMutation };
};
