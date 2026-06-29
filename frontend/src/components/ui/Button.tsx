"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon-circular";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const styles: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 text-button-md cursor-pointer transition-colors " +
    "bg-[var(--color-primary)] text-[var(--color-on-primary)] " +
    "rounded-[var(--radius-xl)] px-[var(--spacing-xl)] py-[var(--spacing-md)] " +
    "hover:bg-[var(--color-primary-active)] active:bg-[var(--color-primary-neutral)] " +
    "disabled:opacity-50 disabled:cursor-not-allowed",

  secondary:
    "inline-flex items-center justify-center gap-2 text-button-md cursor-pointer transition-colors " +
    "bg-[var(--color-canvas-soft)] text-[var(--color-ink)] " +
    "rounded-[var(--radius-xl)] px-[var(--spacing-xl)] py-[var(--spacing-md)] " +
    "hover:brightness-95 active:brightness-90 " +
    "disabled:opacity-50 disabled:cursor-not-allowed",

  tertiary:
    "inline-flex items-center justify-center gap-2 text-button-md cursor-pointer transition-colors " +
    "bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-ink)] " +
    "rounded-[var(--radius-xl)] px-[var(--spacing-xl)] py-[var(--spacing-md)] " +
    "hover:bg-[var(--color-canvas-soft)] active:bg-[var(--color-canvas-soft)] " +
    "disabled:opacity-50 disabled:cursor-not-allowed",

  "icon-circular":
    "inline-flex items-center justify-center cursor-pointer transition-colors " +
    "bg-[var(--color-canvas)] text-[var(--color-ink)] " +
    "rounded-[var(--radius-full)] p-[var(--spacing-sm)] " +
    "hover:bg-[var(--color-canvas-soft)] active:bg-[var(--color-canvas-soft)] " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
