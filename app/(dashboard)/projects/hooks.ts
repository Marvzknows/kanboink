import { CreateBoardApi } from "@/app/(apiFn)/boardsApi";
import { GetUserListApi } from "@/app/(apiFn)/userApi";
import { PaginatedResponseT, UserT } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type PaginationApiParamsT = {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
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

  return { createBoardMutation, useUserList };
};
