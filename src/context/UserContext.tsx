import React from "react";

export type User = {
    username: string;
    roles: string[];
} | null;

export type UserContextType = {
    user: User;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
};

export const UserContext = React.createContext<UserContextType | undefined>(undefined);