"use client";

interface CuisinePillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function CuisinePill({ label, active = false, onClick }: CuisinePillProps) {
  return (
    <button
      onClick={onClick}
      className="text-body-sm-strong rounded-[var(--radius-pill)] px-[var(--spacing-lg)] py-[var(--spacing-xs)] transition-colors cursor-pointer border"
      style={{
        backgroundColor: active ? "var(--color-primary)" : "var(--color-canvas)",
        color: active ? "var(--color-on-primary)" : "var(--color-ink)",
        borderColor: active ? "var(--color-primary)" : "var(--color-ink)",
      }}
    >
      {label}
    </button>
  );
}
