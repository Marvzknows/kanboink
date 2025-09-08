export type MeResponse = {
  succes: boolean;
  data: UserDataT;
  status: number;
};

export type UserDataT = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  ownedBoards: OwnedBoardsT[];
  memberBoards: MemberBoardsT[];
  stats: {
    ownedBoardsCount: number;
    memberBoardsCount: number;
    cardsCount: number;
    commentsCount: number;
  };
};

export type OwnedBoardsT = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};

export type MemberBoardsT = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};
