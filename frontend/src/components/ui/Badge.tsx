import { ReactNode } from "react";

type BadgeVariant = "positive" | "negative" | "warning" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  positive:
    "bg-[var(--color-primary-pale)] text-[var(--color-positive-deep)]",
  negative:
    "bg-[var(--color-negative-bg)] text-[var(--color-canvas)]",
  warning:
    "bg-[var(--color-warning)] text-[var(--color-warning-content)]",
  neutral:
    "bg-[var(--color-canvas-soft)] text-[var(--color-body)]",
};

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={
        `inline-flex items-center text-body-sm-strong ` +
        `rounded-[var(--radius-pill)] px-[var(--spacing-md)] py-[var(--spacing-xs)] ` +
        `${styles[variant]} ${className}`
      }
    >
      {children}
    </span>
  );
}
