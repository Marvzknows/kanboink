import { UserT } from "@/utils/types";

export const prioritiesOptions = [
  {
    name: "Low",
    value: "LOW",
  },
  {
    name: "Medium",
    value: "MEDIUM",
  },
  {
    name: "High",
    value: "HIGH",
  },
  {
    name: "Urgent",
    value: "URGENT",
  },
];

export const taskLists = [
  {
    name: "Pending Task",
    value: "Pending Task",
  },
  {
    name: "In Progress",
    value: "In Progress",
  },
  {
    name: "Completed",
    value: "Completed",
  },
  {
    name: "Bugs",
    value: "Bugs",
  },
  {
    name: "Ready for Deployment",
    value: "Ready for Deployment",
  },
];

export type SelectOptionsT = {
  name: string;
  value: string;
};

export type ListT = {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: CardT[];
};

export type CardT = {
  id: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  listId: string;
  priority: string;
  createdBy: UserT | null;
  createdAt: string;
};

export type ResponseT<T> = {
  data: T;
  success: boolean;
};

export type UserBoardProjectT = {
  board: {
    id: string;
    title: string;
    owner: UserT;
    members: UserT[];
    lists: ListT[];
  };
};

export type UpdateListPositionT = {
  listId: string;
  newPosition: number;
  boardId: string;
};
