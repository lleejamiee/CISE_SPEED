"use client";

import { User } from "@/type/User";
import { createContext, ReactNode, useState } from "react";

interface AuthenticationContextType {
    isLoggedIn: boolean;
    user: User | undefined;
    login: (user: User) => void;
    logout: () => void;
}

export const AuthenticationContext = createContext<AuthenticationContextType>(
    {} as AuthenticationContextType
);

export const AuthenticationProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    const login = (user: User) => {
        setUser(user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(undefined);
    };

    return (
        <AuthenticationContext.Provider
            value={{ isLoggedIn, user, login, logout }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};
