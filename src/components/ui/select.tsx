import { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className = "", children, ...props },
  ref
) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-xs font-semibold tracking-wide uppercase text-ink/70">
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        className={`w-full px-4 py-3 text-sm bg-ivory border rounded-sm transition-colors duration-150 outline-none ${
          error ? "border-red-400 focus:border-red-500" : "border-ink/15 focus:border-maroon"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
