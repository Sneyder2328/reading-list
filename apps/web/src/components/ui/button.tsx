import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "bg-primary text-white hover:bg-blue-500 focus-visible:ring-blue-400 disabled:bg-blue-300",
  secondary:
    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:ring-zinc-500 disabled:bg-zinc-600",
  ghost:
    "bg-transparent text-zinc-200 hover:bg-zinc-800 focus-visible:ring-zinc-500 disabled:text-zinc-500",
  danger:
    "bg-danger text-white hover:bg-red-500 focus-visible:ring-red-400 disabled:bg-red-300",
  outline:
    "border border-zinc-600 bg-transparent text-zinc-100 hover:bg-zinc-800 focus-visible:ring-zinc-500",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed",
          buttonVariants[variant],
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
