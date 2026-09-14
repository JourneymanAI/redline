import Link from "next/link";
import styles from "./Navigation.module.css";

type NavigationProps = {
  isLoggedIn?: boolean;
};

export default function Navigation({ isLoggedIn = false }: NavigationProps) {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.wordmark}>
        ReviewIt
      </Link>
      <div className={styles.links}>
        <Link href="/resources" className={styles.link}>
          Resources
        </Link>
        {isLoggedIn ? (
          <Link href="/account" className={styles.link}>
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className={styles.signIn}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
