"use client"; // This tells React that the following component is client-side

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the User interface
export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  region: string;
  exp: number;
  level: number;
  total_disposal: number;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create the UserContext with default value as null for user and a noop function for setUser
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}, // noop function for setUser, will be replaced by the provider
});

// Create a UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
