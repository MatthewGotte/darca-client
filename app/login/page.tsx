import Image from "next/image";
import LoginForm from "./login-form";
import { getSafeCallbackUrl } from "@/lib/auth/safe-redirect";
import styles from "./login-page.module.css";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.formPanel} aria-label="Sign in">
          <div className={styles.formInner}>
            <h1 className={styles.heading}>
              Welcome back to
              <span className={styles.headingAccent}>Management Made Simple</span>
            </h1>
            <p className={styles.subheading}>
              Sign in to manage assets, jobs, and compliance across your
              organisation.
            </p>

            <LoginForm
              callbackUrl={getSafeCallbackUrl(params.callbackUrl)}
              resetSuccess={params.reset === "success"}
            />

            <p className={styles.footer}>
              Don&apos;t have an account? Contact your administrator.
            </p>
          </div>
        </section>

        <aside className={styles.brandPanel} aria-hidden="true">
          <div className={styles.logoWrap}>
            <Image
              src="/darca-brand-logo-light.png"
              alt="DARCA Asset Management"
              fill
              priority
              sizes="(min-width: 992px) 380px, 0px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
