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

export type UserT = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
};
