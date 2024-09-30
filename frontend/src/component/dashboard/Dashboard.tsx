"use client";

import Content from "@/components/dashboardContent";
import Navbar from "@/components/navbar";
import { AuthenticationContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Dashboard() {
    const authContext = useContext(AuthenticationContext);

    if (!authContext) {
        return <div>loading</div>;
    }

    const { isLoggedIn, user, logout } = authContext;

    console.log("isLoggedIn: " + isLoggedIn);
    console.log("User: " + user);

    return (
        <>
            <div>User role: {user?.role}</div>
            <Navbar></Navbar>
            <Content></Content>
        </>
    );
}
