import Link from "next/link";
import { login, signup } from "./actions";
import styles from "./login.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkEmail?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "login";

  return (
    <main className={styles.page}>
      <div className={styles.wordmark}>REDLINE</div>
      <h1 className={styles.heading}>
        {mode === "signup" ? "Create an account" : "Sign in"}
      </h1>

      {params.error && <p className={styles.error}>{params.error}</p>}
      {params.checkEmail && (
        <p className={styles.notice}>
          Check your email for a confirmation link, then sign in below.
        </p>
      )}

      <form
        className={styles.form}
        action={mode === "signup" ? signup : login}
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@yourbusiness.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </div>
        <button className={styles.submit} type="submit">
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className={styles.toggle}>
        {mode === "signup" ? (
          <>
            Already have an account? <Link href="/login">Sign in</Link>
          </>
        ) : (
          <>
            No account yet?{" "}
            <Link href="/login?mode=signup">Create one</Link>
          </>
        )}
      </p>
    </main>
  );
}
