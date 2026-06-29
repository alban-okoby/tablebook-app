import { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface ContentBandProps {
  headline?: ReactNode;
  subtext?: ReactNode;
  children: ReactNode;
  /** Use sage-tinted surface instead of white */
  soft?: boolean;
  centered?: boolean;
}

export function ContentBand({
  headline,
  subtext,
  children,
  soft = false,
  centered = false,
}: ContentBandProps) {
  return (
    <section
      style={{ backgroundColor: soft ? "var(--color-canvas-soft)" : "var(--color-canvas)" }}
      className="py-[var(--spacing-3xl)]"
    >
      <Container>
        {(headline || subtext) && (
          <div className={`mb-[var(--spacing-3xl)] ${centered ? "text-center" : ""}`}>
            {headline && (
              <h2
                className="text-display-md text-[var(--color-ink)]"
              >
                {headline}
              </h2>
            )}
            {subtext && (
              <p
                className="text-body-lg text-[var(--color-body)] mt-[var(--spacing-md)] max-w-[600px]"
                style={{ marginLeft: centered ? "auto" : undefined, marginRight: centered ? "auto" : undefined }}
              >
                {subtext}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
