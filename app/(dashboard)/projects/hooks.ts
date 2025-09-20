import {
  AddBoardMemberApi,
  CreateBoardApi,
  GetBoardsListApip,
  GetUserBoardListApi,
} from "@/app/(apiFn)/boardsApi";
import { CreateBoardListApi, UpdateListPositionApi } from "@/app/(apiFn)/list";
import { GetUserListApi, SetUserActiveBoardApi } from "@/app/(apiFn)/userApi";
import {
  BoardsT,
  PaginatedDataResponseT,
  PaginatedResponseT,
  UserT,
} from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ResponseT,
  UpdateListPositionT,
  UserBoardProjectT,
} from "./_components/types";

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

export type CreateBoardListPaylodT = {
  title: string;
  board_id: string;
};

export type PaginatedBoardListResponse = PaginatedDataResponseT<{
  boards: BoardsT[];
}>;

export const useBoards = () => {
  const queryClient = useQueryClient();

  // POST: Create new Board
  const createBoardMutation = useMutation({
    mutationFn: async (title: string) => {
      return await CreateBoardApi({ title });
    },
    onSuccess: () => {
      // Invalidate userBoardList queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["userBoardList"] });
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
    onSuccess: () => {
      // Invalidate userBoardList queries since board membership affects the list
      queryClient.invalidateQueries({ queryKey: ["userBoardList"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBoardList"] });
    },
  });

  // POST: Create Board list
  const createBoardListMutation = useMutation({
    mutationFn: async (payload: CreateBoardListPaylodT) => {
      return await CreateBoardListApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjectBoardList"] });
    },
  });

  // GET: Get User's project board data
  const userProjectBaordData = (board_id: string, enabled = true) => {
    return useQuery<ResponseT<UserBoardProjectT>>({
      queryKey: ["userProjectBoardList", board_id],
      queryFn: async () => {
        return await GetUserBoardListApi(board_id);
      },
      enabled,
    });
  };

  // PUT: Update List's Position
  const updateBoardListPosition = useMutation({
    mutationFn: async (payload: UpdateListPositionT) => {
      return await UpdateListPositionApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjectBoardList"] });
    },
  });

  return {
    createBoardMutation,
    useUserList,
    addBaordMemberMutation,
    userBoardList,
    setUserActiveBoardMutation,
    createBoardListMutation,
    userProjectBaordData,
    updateBoardListPosition,
  };
};
