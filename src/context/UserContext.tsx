// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {GetCurrentUser} from "../api/login";
type User = {
    username: string;
    roles: string[];
} | null;

type UserContextType = {
    user: User;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        setLoading(true);
        try {
            const data = await GetCurrentUser();
            setUser({ username: data.username, roles: data.roles });
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        setUser(null);
        // Optionally call backend logout endpoint
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};
