import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.link}>
                <button className={styles.button}>Dashboard</button>
            </Link>
            <Link href="/moderation" className={styles.link}>
                <button className={styles.button}>Moderation Queue</button>
            </Link>
            <Link href="/analysis" className={styles.link}>
                <button className={styles.button}>Analysis Queue</button>
            </Link>
            {user?.role === "admin" && ( // Only show if user role is admin
                <Link href="/admin" className={styles.link}>
                    <button className={styles.button}>Admin settings</button>
                </Link>
            )}
            {/* Placeholder */}
            <Link href="/" className={styles.link}>
                <button className={styles.button}>Account</button>
            </Link>
        </nav>
    );
}
