import { Container } from "@/components/layout";

export default function Loading() {
  return (
    <div className="py-[var(--spacing-3xl)]" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Container>
        <div className="flex flex-col gap-[var(--spacing-lg)]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-[var(--radius-xl)] animate-pulse"
              style={{ backgroundColor: "var(--color-canvas-soft)" }}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
