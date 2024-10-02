import Link from "next/link";
import styles from "../../styles/Navbar.module.css";

export default function Navbar() {
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
            <Link href="/admin" className={styles.link}>
                <button className={styles.button}>Admin settings</button>
            </Link>
            <Link href="/" className={styles.link}>
                <button className={styles.button}>Account</button>
            </Link>
        </nav>
    );
}
