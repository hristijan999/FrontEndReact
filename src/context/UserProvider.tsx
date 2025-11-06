import React, { useState, useEffect } from "react";
import type{  User } from "./UserContext";
import {  UserContext } from "./UserContext";
import { GetCurrentUser } from "../api/login";

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
        // optionally call backend
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