import { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

const BASE_STYLES =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "border border-slate-900 bg-slate-900 text-white hover:bg-slate-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300",
  secondary:
    "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800",
};

const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`${BASE_STYLES} ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    />
  );
};

export default Button;
