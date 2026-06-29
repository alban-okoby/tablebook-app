import { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface HeroBandProps {
  /** Left column: headline + subtext + CTA */
  headline: ReactNode;
  subtext?: ReactNode;
  cta?: ReactNode;
  /** Right column: widget (BookingWidget, etc.) */
  widget?: ReactNode;
  /** Use the dark (ink bg + primary text) polarity */
  dark?: boolean;
}

export function HeroBand({ headline, subtext, cta, widget, dark = false }: HeroBandProps) {
  const bg = dark ? "var(--color-ink)" : "var(--color-canvas-soft)";
  const textColor = dark ? "var(--color-primary)" : "var(--color-ink)";
  const subtextColor = dark ? "var(--color-canvas-soft)" : "var(--color-body)";

  return (
    <section
      style={{ backgroundColor: bg }}
      className="py-[var(--spacing-3xl)]"
    >
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center gap-[var(--spacing-3xl)]">
          {/* Left: text content */}
          <div className="flex-1 flex flex-col gap-[var(--spacing-xl)]">
            <h1
              className="text-display-xl"
              style={{ color: textColor }}
            >
              {headline}
            </h1>

            {subtext && (
              <p
                className="text-body-lg max-w-[520px]"
                style={{ color: subtextColor }}
              >
                {subtext}
              </p>
            )}

            {cta && <div className="flex flex-wrap gap-[var(--spacing-md)]">{cta}</div>}
          </div>

          {/* Right: widget */}
          {widget && (
            <div className="w-full lg:w-[400px] shrink-0">
              {widget}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
