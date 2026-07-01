import { LoginForm } from "@/components/auth";

export const metadata = { title: "Sign in — TableBook" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 py-12 overflow-hidden">
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[480px] max-h-[480px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/3"
        style={{ background: "var(--color-primary)", opacity: 0.12 }}
      />
      <div
        className="absolute bottom-0 left-0 w-[30vw] h-[30vw] max-w-[360px] max-h-[360px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"
        style={{ background: "var(--color-primary-pale)", opacity: 0.6 }}
      />

      <div className="relative z-10 w-full max-w-[448px]">
        <LoginForm redirectTo={redirect ?? "/"} />
      </div>
    </div>
  );
}
