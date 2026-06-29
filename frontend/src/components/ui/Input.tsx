"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm-strong text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-[var(--spacing-lg)] text-[var(--color-mute)] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={
              `w-full text-body-md text-[var(--color-ink)] bg-[var(--color-canvas)] ` +
              `border border-[var(--color-ink)] rounded-[var(--radius-md)] ` +
              `px-[var(--spacing-lg)] py-[var(--spacing-md)] ` +
              `placeholder:text-[var(--color-mute)] ` +
              `focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] ` +
              `disabled:opacity-50 disabled:cursor-not-allowed ` +
              `${error ? "border-[var(--color-negative)]" : ""} ` +
              `${leftIcon ? "pl-10" : ""} ` +
              `${rightIcon ? "pr-10" : ""} ` +
              `${className}`
            }
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-[var(--spacing-lg)] text-[var(--color-mute)] pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-caption text-[var(--color-negative)]">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-caption text-[var(--color-mute)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
