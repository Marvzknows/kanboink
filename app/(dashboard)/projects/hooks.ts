import { CreateBoardApi } from "@/app/(apiFn)/boardsApi";
import { useMutation } from "@tanstack/react-query";

export const useBoards = () => {
  // POST: Crete new Board
  const createBoardMutation = useMutation({
    mutationFn: async (title: string) => {
      return await CreateBoardApi({ title });
    },
  });

  return { createBoardMutation };
};
