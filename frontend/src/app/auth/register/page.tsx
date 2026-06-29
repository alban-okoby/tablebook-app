import { RegisterForm } from "@/components/auth";

export const metadata = { title: "Create account — TableBook" };

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-[var(--spacing-3xl)] px-[var(--spacing-xl)]">
      <RegisterForm />
    </div>
  );
}
