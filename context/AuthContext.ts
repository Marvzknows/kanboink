import { createContext } from "react";
export type UserT = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  createdAt: string;
};

export type AuthContextType = {
  user: UserT | null;
  setUserAuth: (user: UserT) => void;
  logout: () => void;
  loadingLogout: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUserAuth: () => {},
  logout: () => {},
  loadingLogout: false,
});
