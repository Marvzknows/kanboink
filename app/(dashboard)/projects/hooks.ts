import {
  AddBoardMemberApi,
  CreateBoardApi,
  GetBoardsListApip,
} from "@/app/(apiFn)/boardsApi";
import { GetUserListApi, SetUserActiveBoardApi } from "@/app/(apiFn)/userApi";
import {
  BoardsT,
  PaginatedDataResponseT,
  PaginatedResponseT,
  UserT,
} from "@/utils/types";
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

export type PaginatedBoardListResponse = PaginatedDataResponseT<{
  boards: BoardsT[];
}>;

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

  // GET: Get Owner's list of board
  const userBoardList = ({
    search,
    page,
    limit,
    enabled = true,
  }: PaginationApiParamsT) => {
    return useQuery<PaginatedBoardListResponse>({
      queryKey: ["userBoardList", search, page, limit],
      queryFn: async () => {
        return await GetBoardsListApip({ search, page, limit });
      },
      enabled,
    });
  };

  // POST: Set Active Board
  const setUserActiveBoardMutation = useMutation({
    mutationFn: async (board_id: string) => {
      return await SetUserActiveBoardApi({
        board_id: board_id,
      });
    },
  });

  return {
    createBoardMutation,
    useUserList,
    addBaordMemberMutation,
    userBoardList,
    setUserActiveBoardMutation,
  };
};
