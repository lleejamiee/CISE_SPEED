"use client";

import { AuthenticationContext } from "@/context/AuthContext";
import { useContext } from "react";
import Navbar from "../../components/navbar/navbar";
import DashboardContent from "@/components/dashboard/DashboardContent";

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
            <Navbar></Navbar>
            <div>User role: {user?.role}</div>
            <DashboardContent />
        </>
    );
}

