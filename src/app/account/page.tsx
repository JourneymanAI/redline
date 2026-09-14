import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.wordmark}>ReviewIt</div>
        <form action={logout}>
          <button className={styles.signOutBtn} type="submit">
            Sign out
          </button>
        </form>
      </div>

      <div className={styles.content}>
        <div className={styles.welcome}>
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.email}>{user.email}</p>
          <p className={styles.description}>
            Ready to review a contract? Upload it below and we'll flag every clause that works against you.
          </p>
        </div>

        <Link href="/review/new" className={styles.analyzeButton}>
          Analyze a contract
        </Link>
      </div>
    </main>
  );
}
