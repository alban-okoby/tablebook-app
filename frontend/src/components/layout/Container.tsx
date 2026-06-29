import { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1200px] px-[var(--spacing-xl)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
