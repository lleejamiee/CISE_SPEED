import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/home" className={styles.link}>
                <button className={styles.button}>Dashboard</button>
            </Link>
            <Link href="/moderation" className={styles.link}>
                <button className={styles.button}>Moderation Queue</button>
            </Link>
            <Link href="/services" className={styles.link}>
                <button className={styles.button}>Analysis Queue</button>
            </Link>
            <Link href="/contact" className={styles.link}>
                <button className={styles.button}>Admin settings</button>
            </Link>
        </nav>
    );
}
