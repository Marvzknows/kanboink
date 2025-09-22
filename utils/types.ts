export type PaginationMetaDataT = {
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  currentPage: number;
};

export type PaginatedResponseT<T> = {
  success: boolean;
  data: {
    users: T[];
  };
  pagination: PaginationMetaDataT;
};

export type PaginatedDataResponseT<DataT> = {
  success: boolean;
  data: DataT;
  pagination: PaginationMetaDataT;
};

export type UserT = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
};

export type MembersT = {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
};

export type OwnerT = {
  id: string;
  ownerId: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
};

export type BoardsT = {
  id: string;
  ownerId: string;
  title: string;
  members: MembersT[];
  owner: OwnerT;
  createdAt: string;
  updatedAt: string;
};
