"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout";
import { Button, Card } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <Card variant="sage" className="max-w-lg mx-auto text-center py-[var(--spacing-3xl)]">
          <p className="text-display-xs mb-[var(--spacing-sm)]">⚠️</p>
          <h1 className="text-display-sm text-[var(--color-ink)] mb-[var(--spacing-sm)]">
            Something went wrong
          </h1>
          <p className="text-body-md text-[var(--color-mute)] mb-[var(--spacing-xl)]">
            We hit an unexpected error. You can try again or head back home.
          </p>
          <div className="flex items-center justify-center gap-[var(--spacing-md)]">
            <Button variant="primary" onClick={reset}>Try again</Button>
            <Link href="/">
              <Button variant="secondary">Go home</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
