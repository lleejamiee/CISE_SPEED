import { createContext, ReactNode, useState } from "react";

interface AuthenticationContextType {
    isLoggedIn: boolean;
    userRole: string;
    username: string;
    login: (username: string, role: string) => void;
    logout: () => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(
    null
);

export const AuthenticationProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const login = (username: string, role: string) => {
        setIsLoggedIn(true);
        setUserRole(role);
        setUsername(username);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole("");
        setUsername("");
    };

    return (
        <AuthenticationContext.Provider
            value={{ isLoggedIn, userRole, username, login, logout }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};
