import { LoginForm } from "@/components/auth";

export const metadata = { title: "Sign in — TableBook" };

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-[var(--spacing-3xl)] px-[var(--spacing-xl)]">
      <LoginForm />
    </div>
  );
}
