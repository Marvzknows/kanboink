import { useMutation } from "@tanstack/react-query";
import { CreateBoardApi } from "@/app/(apiFn)/boardsApi";

type CreateBoardPayloadT = {
  title: string;
};

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: async (title: CreateBoardPayloadT) => {
      return await CreateBoardApi(title);
    },
  });
};
