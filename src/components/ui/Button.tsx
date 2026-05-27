import React from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-secondary active:scale-[0.98] shadow-sm shadow-brand-primary/10",
      secondary:
        "bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-[0.98]",
      outline:
        "border border-slate-100 bg-transparent text-slate-600 hover:bg-slate-50 active:scale-[0.98]",
      ghost:
        "bg-transparent text-slate-500 hover:bg-slate-50 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[11px] font-bold",
      md: "px-4 py-2.5 text-xs font-bold",
      lg: "px-6 py-3.5 text-sm font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
