import { useQuery } from "@tanstack/react-query";
import { MeResponse } from "../types";
import { GetMeApi } from "@/app/(apiFn)/auth";

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: () => {
      return GetMeApi();
    },
  });
};
