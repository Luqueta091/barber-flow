import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({ children, variant = "primary", fullWidth = false, className = "", ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20 focus:ring-primary-600",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-800/20 focus:ring-slate-800",
    outline: "border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 focus:ring-slate-200",
    ghost: "text-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-200",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
