"use client";

import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { AuthenticationContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Navbar() {
    const authContext = useContext(AuthenticationContext);
    const { user } = authContext;

    return (
        <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.link}>
                <button className={styles.button}>Dashboard</button>
            </Link>

            {(user?.role === "moderator" || user?.role === "admin") && (
                <Link href="/moderation" className={styles.link}>
                    <button className={styles.button}>Moderation Queue</button>
                </Link>
            )}

            {(user?.role === "analyst" || user?.role === "admin") && (
                <Link href="/analysis" className={styles.link}>
                    <button className={styles.button}>Analysis Queue</button>
                </Link>
            )}

            {user?.role === "admin" && (
                <Link href="/admin" className={styles.link}>
                    <button className={styles.button}>Admin settings</button>
                </Link>
            )}

            <Link href="/" className={styles.link}>
                <button className={styles.button}>Account</button>
            </Link>
        </nav>
    );
}