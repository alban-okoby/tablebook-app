import Link from "next/link";
import { Container } from "@/components/layout";
import { Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <Card variant="sage" className="max-w-lg mx-auto text-center py-[var(--spacing-3xl)]">
          <p className="text-display-xl text-[var(--color-mute)] mb-[var(--spacing-sm)]">404</p>
          <h1 className="text-display-sm text-[var(--color-ink)] mb-[var(--spacing-sm)]">
            Page not found
          </h1>
          <p className="text-body-md text-[var(--color-mute)] mb-[var(--spacing-xl)]">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="flex items-center justify-center gap-[var(--spacing-md)]">
            <Link href="/">
              <Button variant="primary">Go home</Button>
            </Link>
            <Link href="/restaurants">
              <Button variant="secondary">Browse restaurants</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
