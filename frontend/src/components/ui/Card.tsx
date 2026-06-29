import { ReactNode, HTMLAttributes } from "react";

type CardVariant = "content" | "sage" | "green" | "dark";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const styles: Record<CardVariant, string> = {
  content:
    "bg-[var(--color-canvas)] text-[var(--color-ink)]",
  sage:
    "bg-[var(--color-canvas-soft)] text-[var(--color-ink)]",
  green:
    "bg-[var(--color-primary-pale)] text-[var(--color-ink)]",
  dark:
    "bg-[var(--color-ink)] text-[var(--color-primary)]",
};

export function Card({ variant = "content", children, className = "", ...props }: CardProps) {
  return (
    <div
      className={
        `rounded-[var(--radius-xl)] p-[var(--spacing-xl)] ` +
        `${styles[variant]} ${className}`
      }
      {...props}
    >
      {children}
    </div>
  );
}
