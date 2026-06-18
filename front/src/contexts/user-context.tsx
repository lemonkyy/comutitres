"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useApiClient } from "@/contexts/api-client";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { Me, User } from "@/utils/types";

type UserContextType = {
  myUser: Me | null;
  userList: User[] | null;
  setUserList: (users: User[] | null) => void;
  getAll: () => Promise<User[] | ApiClientError>;
  getMyUser: () => Promise<Me | ApiClientError>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { apiClient } = useApiClient();
  const [myUser, setMyUser] = useState<Me | null>(null);
  const [userList, setUserList] = useState<User[] | null>(null);

  const getMyUser = useCallback(async (): Promise<Me | ApiClientError> => {
    const result = await apiClient.me.get();
    if (result instanceof ApiClientError) {
      setMyUser(null);
      return result;
    }

    setMyUser(result);
    return result;
  }, [apiClient]);

  const getAll = useCallback(async (): Promise<User[] | ApiClientError> => {
    const result = await apiClient.user.getCollection();

    if (result instanceof ApiClientError) {
      return result;
    }

    setUserList(result);
    return result;
  }, [apiClient]);

  useEffect(() => {
    const refreshMyUser = () => {
      void getMyUser();
    };

    refreshMyUser();
    const interval = setInterval(refreshMyUser, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, [getMyUser]);

  return (
    <UserContext.Provider value={{ myUser, userList, setUserList, getAll, getMyUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }

  return context;
};