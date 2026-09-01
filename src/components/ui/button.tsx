import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed rounded-sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-maroon text-ivory hover:bg-maroon-dark active:scale-[0.98] shadow-sm hover:shadow-md",
  secondary:
    "bg-gold text-maroon-dark hover:bg-gold-muted active:scale-[0.98] shadow-sm hover:shadow-md",
  outline:
    "border border-maroon text-maroon hover:bg-maroon hover:text-ivory active:scale-[0.98]",
  ghost: "text-maroon hover:bg-maroon/5 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", href, children, ...props },
  ref
) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});
