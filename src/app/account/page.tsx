import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import styles from "../login/login.module.css";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.wordmark}>REDLINE</div>
      <h1 className={styles.heading}>Signed in</h1>
      <p className={styles.toggle}>{user.email}</p>
      <form action={logout}>
        <button className={styles.submit} type="submit">
          Sign out
        </button>
      </form>
    </main>
  );
}
